import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { SiteVisit } from "@/models/SiteVisit";

export async function GET() {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  await connectDB();
  const visits = await SiteVisit.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    visits: visits.map((v) => ({
      id: String(v._id),
      name: v.name,
      phone: v.phone,
      email: v.email,
      projectSlug: v.projectSlug,
      date: v.date,
      time: v.time,
      pickupRequired: v.pickupRequired,
      pickupAddress: v.pickupAddress,
      status: v.status,
      createdAt: v.createdAt,
    })),
  });
}
