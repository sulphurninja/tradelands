import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";

export async function GET() {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    leads: leads.map((l) => ({
      id: String(l._id),
      name: l.name,
      email: l.email,
      phone: l.phone,
      projectSlug: l.projectSlug,
      interest: l.interest,
      message: l.message,
      source: l.source,
      status: l.status,
      createdAt: l.createdAt,
    })),
  });
}
