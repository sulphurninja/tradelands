import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  const body = await request.json();
  const doc = await Lead.findByIdAndUpdate(
    id,
    { status: body.status, assignedTo: body.assignedTo },
    { new: true }
  ).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await Lead.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
