import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";
import { User } from "@/models/User";
import type { Types } from "mongoose";

export async function createNotification(input: {
  userId: string | Types.ObjectId;
  title: string;
  body?: string;
  href?: string;
  type?: "site-visit" | "system" | "lead" | "offer";
}) {
  await connectDB();
  return Notification.create({
    userId: input.userId,
    title: input.title,
    body: input.body || "",
    href: input.href,
    type: input.type || "system",
  });
}

export async function notifyStaff(input: {
  title: string;
  body?: string;
  href?: string;
  type?: "site-visit" | "system" | "lead" | "offer";
}) {
  await connectDB();
  const staff = await User.find({
    role: { $in: ["sales", "admin", "superadmin"] },
    active: { $ne: false },
  })
    .select("_id email")
    .lean();

  if (!staff.length) return [];

  await Notification.insertMany(
    staff.map((u) => ({
      userId: u._id,
      title: input.title,
      body: input.body || "",
      href: input.href,
      type: input.type || "system",
    }))
  );

  return staff.map((u) => ({
    id: String(u._id),
    email: String(u.email),
  }));
}
