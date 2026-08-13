import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  sendEmail,
  siteVisitRequestedHtml,
  staffVisitAlertHtml,
} from "@/lib/email";
import { createNotification, notifyStaff } from "@/lib/notifications";
import { getSiteConfig } from "@/lib/platform-settings";
import { ProjectModel } from "@/models/Project";
import { SiteVisit } from "@/models/SiteVisit";
import { User } from "@/models/User";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  projectSlug: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  pickupRequired: z.boolean().optional(),
  pickupAddress: z.string().optional(),
  referralCode: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const site = await getSiteConfig();
    if (!site.enableSiteVisits) {
      return NextResponse.json(
        { error: "Site visit booking is temporarily unavailable." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = schema.parse(body);
    const session = await getSession();

    await connectDB();

    let agentId: string | undefined;
    let referralCode = data.referralCode?.trim() || undefined;
    if (referralCode) {
      const agent = await User.findOne({
        referralCode,
        role: "sales",
        active: { $ne: false },
      }).lean();
      if (agent) agentId = String(agent._id);
    } else if (session?.role === "sales") {
      agentId = session.sub;
      const self = await User.findById(session.sub).select("referralCode").lean();
      referralCode = self?.referralCode || undefined;
    }

    const visit = await SiteVisit.create({
      ...data,
      email: data.email || undefined,
      userId: session?.sub,
      pickupRequired: data.pickupRequired ?? false,
      agentId,
      referralCode,
      status: "requested",
    });

    const project = await ProjectModel.findOne({ slug: data.projectSlug })
      .select("name")
      .lean();
    const projectName = project?.name || data.projectSlug;

    if (data.email) {
      await sendEmail({
        to: data.email,
        subject: `Site visit request — ${projectName}`,
        html: siteVisitRequestedHtml({
          name: data.name,
          project: projectName,
          date: data.date,
          time: data.time,
        }),
        text: `Hi ${data.name}, we received your site visit request for ${projectName} on ${data.date} at ${data.time}.`,
      });
    }

    if (session?.sub) {
      await createNotification({
        userId: session.sub,
        title: "Site visit requested",
        body: `${projectName} · ${data.date} ${data.time}`,
        href: "/dashboard/site-visits",
        type: "site-visit",
      });
    }

    const staff = await notifyStaff({
      title: "New site visit request",
      body: `${data.name} · ${projectName} · ${data.date} ${data.time}`,
      href: session?.role === "sales" ? "/crm/site-visits" : "/admin/site-visits",
      type: "site-visit",
    });

    const staffEmails = staff.map((s) => s.email).filter(Boolean);
    if (staffEmails.length) {
      await sendEmail({
        to: staffEmails,
        subject: `New site visit — ${projectName}`,
        html: staffVisitAlertHtml({
          name: data.name,
          phone: data.phone,
          email: data.email,
          project: projectName,
          date: data.date,
          time: data.time,
        }),
      });
    }

    return NextResponse.json({
      ok: true,
      id: visit._id.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please complete the site visit form." },
        { status: 400 }
      );
    }
    console.error("Site visit error:", error);
    return NextResponse.json(
      { error: "Unable to book site visit right now." },
      { status: 500 }
    );
  }
}
