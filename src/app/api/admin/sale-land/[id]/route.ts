import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { SaleLandListing } from "@/models/SaleLandListing";

interface Props {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  status: z
    .enum([
      "new",
      "reviewing",
      "contacted",
      "site-visit",
      "listed",
      "rejected",
      "closed",
    ])
    .optional(),
  adminNotes: z.string().max(2000).optional(),
  assignedTo: z.string().max(120).optional(),
});

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    const body = updateSchema.parse(await request.json());
    await connectDB();
    const doc = await SaleLandListing.findByIdAndUpdate(
      id,
      {
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNotes !== undefined
          ? { adminNotes: body.adminNotes }
          : {}),
        ...(body.assignedTo !== undefined
          ? { assignedTo: body.assignedTo }
          : {}),
      },
      { new: true }
    ).lean();

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireStaff();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await SaleLandListing.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
