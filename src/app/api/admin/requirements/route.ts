import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { LandRequirement } from "@/models/LandRequirement";

export async function GET() {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;

  await connectDB();
  const docs = await LandRequirement.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    items: docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      phone: d.phone,
      location: d.location,
      kmRange: d.kmRange,
      acres: d.acres,
      priceRange: d.priceRange,
      status: d.status || "new",
      adminNotes: d.adminNotes || "",
      source: d.source || "",
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  });
}
