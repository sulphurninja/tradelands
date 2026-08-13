import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const items = await Notification.find({ userId: session.sub })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const unread = await Notification.countDocuments({
    userId: session.sub,
    read: false,
  });

  return NextResponse.json({
    unread,
    notifications: items.map((n) => ({
      id: String(n._id),
      title: n.title,
      body: n.body || "",
      href: n.href || null,
      type: n.type,
      read: Boolean(n.read),
      createdAt: n.createdAt,
    })),
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  await connectDB();

  if (body.all) {
    await Notification.updateMany(
      { userId: session.sub, read: false },
      { $set: { read: true } }
    );
  } else if (body.id) {
    await Notification.updateOne(
      { _id: body.id, userId: session.sub },
      { $set: { read: true } }
    );
  }

  return NextResponse.json({ ok: true });
}
