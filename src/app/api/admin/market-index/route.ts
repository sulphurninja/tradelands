import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeMarketIndex } from "@/lib/serialize";
import { slugify } from "@/lib/format";
import { MarketIndex } from "@/models/MarketIndex";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await MarketIndex.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return NextResponse.json({
    items: docs.map((d) => serializeMarketIndex(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const slug = body.slug || slugify(body.name || "index");
    const doc = await MarketIndex.create({
      ...body,
      slug,
      pricePerSqFt: Number(body.pricePerSqFt) || 0,
      changePct: Number(body.changePct) || 0,
      sortOrder: Number(body.sortOrder) || 0,
    });
    return NextResponse.json({
      item: serializeMarketIndex(doc.toObject() as never),
    });
  } catch {
    return NextResponse.json({ error: "Unable to create index" }, { status: 500 });
  }
}
