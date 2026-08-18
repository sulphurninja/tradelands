import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { LandRequirement } from "@/models/LandRequirement";

interface Props {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  status: z
    .enum(["new", "reviewing", "contacted", "matched", "closed", "rejected"])
    .optional(),
  adminNotes: z.string().max(2000).optional(),
});

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    const body = updateSchema.parse(await request.json());
    await connectDB();
    const doc = await LandRequirement.findByIdAndUpdate(
      id,
      {
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined
          ? { adminNotes: body.adminNotes }
          : {}),
      },
      { new: true }
    );
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await LandRequirement.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
