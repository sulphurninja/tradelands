import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { sendEmail, siteVisitConfirmedHtml, SALES_INBOX } from "@/lib/email";
import { createNotification } from "@/lib/notifications";
import { ProjectModel } from "@/models/Project";
import { SiteVisit } from "@/models/SiteVisit";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  const body = await request.json();
  const prev = await SiteVisit.findById(id).lean();
  if (!prev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const doc = await SiteVisit.findByIdAndUpdate(
    id,
    { status: body.status, feedback: body.feedback },
    { new: true }
  ).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const becameConfirmed =
    body.status === "confirmed" && prev.status !== "confirmed";

  if (becameConfirmed) {
    const project = await ProjectModel.findOne({ slug: doc.projectSlug })
      .select("name")
      .lean();
    const projectName = project?.name || String(doc.projectSlug || "project");

    if (doc.email) {
      await sendEmail({
        to: String(doc.email),
        subject: `Site visit confirmed — ${projectName}`,
        html: siteVisitConfirmedHtml({
          name: String(doc.name),
          project: projectName,
          date: String(doc.date),
          time: String(doc.time),
        }),
        text: `Hi ${doc.name}, your visit to ${projectName} is confirmed for ${doc.date} at ${doc.time}.`,
        copySales: true,
      });
    } else {
      await sendEmail({
        to: SALES_INBOX,
        subject: `Site visit confirmed — ${projectName}`,
        html: siteVisitConfirmedHtml({
          name: String(doc.name),
          project: projectName,
          date: String(doc.date),
          time: String(doc.time),
        }),
      });
    }

    if (doc.userId) {
      await createNotification({
        userId: doc.userId,
        title: "Site visit confirmed",
        body: `${projectName} · ${doc.date} ${doc.time} · ${doc.phone}`,
        href: "/dashboard/site-visits",
        type: "site-visit",
      });
    }
  }

  return NextResponse.json({ ok: true });
}
