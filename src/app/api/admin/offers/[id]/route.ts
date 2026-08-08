import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeOffer } from "@/lib/serialize";
import { Offer } from "@/models/Offer";

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
    if (typeof body.highlights === "string") {
      body.highlights = body.highlights
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    const doc = await Offer.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ offer: serializeOffer(doc as never) });
  } catch {
    return NextResponse.json(
      { error: "Unable to update offer" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await Offer.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
