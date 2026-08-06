import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeConcept } from "@/lib/serialize";
import { Concept } from "@/models/Concept";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();
    delete body.id;
    const doc = await Concept.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ concept: serializeConcept(doc as never) });
  } catch {
    return NextResponse.json(
      { error: "Unable to update concept" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await Concept.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
