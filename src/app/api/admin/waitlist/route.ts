import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeWaitlist } from "@/lib/serialize";
import { WaitlistEntry } from "@/models/WaitlistEntry";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await WaitlistEntry.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    items: docs.map((d) => serializeWaitlist(d as never)),
  });
}
