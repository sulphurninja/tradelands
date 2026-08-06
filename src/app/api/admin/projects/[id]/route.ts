import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeProject } from "@/lib/serialize";
import { ProjectModel } from "@/models/Project";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  const doc = await ProjectModel.findById(id).lean();
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project: serializeProject(doc as never) });
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    await connectDB();
    const body = await request.json();
    delete body.id;
    delete body._id;
    delete body.createdAt;
    const doc = await ProjectModel.findByIdAndUpdate(
      id,
      { ...body, pricing: { currency: "INR", ...body.pricing } },
      { new: true }
    ).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project: serializeProject(doc as never) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await ProjectModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
