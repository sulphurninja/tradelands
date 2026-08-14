import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeMarketLocation } from "@/lib/serialize";
import { MarketLocation } from "@/models/MarketLocation";

interface Props {
  params: Promise<{ id: string }>;
}

function parseSeries(body: {
  series?: unknown;
  seriesText?: string;
}) {
  if (Array.isArray(body.series)) return body.series;
  return String(body.seriesText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [year, price] = line.split(/[,:\s]+/);
      return { year: Number(year), pricePerSqFt: Number(price) };
    })
    .filter(
      (p) => Number.isFinite(p.year) && Number.isFinite(p.pricePerSqFt)
    );
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();
    const doc = await MarketLocation.findByIdAndUpdate(
      id,
      {
        ...body,
        lat: Number(body.lat) || 0,
        lng: Number(body.lng) || 0,
        changePct: Number(body.changePct) || 0,
        sortOrder: Number(body.sortOrder) || 0,
        series: parseSeries(body),
      },
      { new: true }
    ).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      item: serializeMarketLocation(doc as never),
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
  await MarketLocation.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
