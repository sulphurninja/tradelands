import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { SaleLandListing } from "@/models/SaleLandListing";

export async function GET() {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;

  await connectDB();
  const docs = await SaleLandListing.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    items: docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      phone: d.phone,
      landSize: d.landSize || "",
      pinLocation: d.pinLocation,
      rate: d.rate,
      photos: d.photos || [],
      documents: d.documents || [],
      notes: d.notes || "",
      status: d.status || "new",
      adminNotes: d.adminNotes || "",
      assignedTo: d.assignedTo || "",
      source: d.source || "",
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  });
}
