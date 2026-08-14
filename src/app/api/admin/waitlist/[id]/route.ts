import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { WaitlistEntry } from "@/models/WaitlistEntry";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await WaitlistEntry.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
