import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeMarketIndex } from "@/lib/serialize";
import { MarketIndex } from "@/models/MarketIndex";

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
    const doc = await MarketIndex.findByIdAndUpdate(
      id,
      {
        ...body,
        pricePerSqFt: Number(body.pricePerSqFt) || 0,
        changePct: Number(body.changePct) || 0,
        sortOrder: Number(body.sortOrder) || 0,
      },
      { new: true }
    ).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      item: serializeMarketIndex(doc as never),
    });
  } catch {
    return NextResponse.json({ error: "Unable to update" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  await MarketIndex.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
