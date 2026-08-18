import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  sendEmail,
  siteVisitRequestedHtml,
  staffVisitAlertHtml,
  SALES_INBOX,
} from "@/lib/email";
import { createNotification, notifyStaff } from "@/lib/notifications";
import { getSiteConfig } from "@/lib/platform-settings";
import { ProjectModel } from "@/models/Project";
import { SiteVisit } from "@/models/SiteVisit";
import { User } from "@/models/User";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().min(10, "Phone is required")),
  email: z.union([z.literal(""), z.string().trim().email("Invalid email")]),
  projectSlug: z.string().min(1, "Project is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
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
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      projectSlug: data.projectSlug,
      date: data.date,
      time: data.time,
      userId: session?.sub,
      pickupRequired: false,
      pickupAddress: undefined,
      agentId,
      referralCode,
      status: "requested",
    });

    const project = await ProjectModel.findOne({ slug: data.projectSlug })
      .select("name")
      .lean();
    const projectName = project?.name || data.projectSlug;

    // Notifications / email must not fail the booking
    try {
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
          copySales: true,
        });
      } else {
        // No client email — still alert sales desk
        await sendEmail({
          to: SALES_INBOX,
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

      if (session?.sub) {
        await createNotification({
          userId: session.sub,
          title: "Site visit requested",
          body: `${projectName} · ${data.date} ${data.time} · ${data.phone}`,
          href: "/dashboard/site-visits",
          type: "site-visit",
        });
      }

      const staff = await notifyStaff({
        title: "New site visit request",
        body: `${data.name} · ${data.phone} · ${projectName} · ${data.date} ${data.time}`,
        href:
          session?.role === "sales" ? "/crm/site-visits" : "/admin/site-visits",
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
          copySales: true,
        });
      }
    } catch (notifyError) {
      console.error("Site visit notify error:", notifyError);
    }

    return NextResponse.json({
      ok: true,
      id: visit._id.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const first = error.issues[0]?.message || "Please complete the site visit form.";
      return NextResponse.json({ error: first }, { status: 400 });
    }
    console.error("Site visit error:", error);
    return NextResponse.json(
      { error: "Unable to book site visit right now." },
      { status: 500 }
    );
  }
}
