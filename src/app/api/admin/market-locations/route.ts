import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeMarketLocation } from "@/lib/serialize";
import { slugify } from "@/lib/format";
import { MarketLocation } from "@/models/MarketLocation";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await MarketLocation.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return NextResponse.json({
    items: docs.map((d) => serializeMarketLocation(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const slug = body.slug || slugify(body.name || "location");
    const series = Array.isArray(body.series)
      ? body.series
      : String(body.seriesText || "")
          .split("\n")
          .map((line: string) => line.trim())
          .filter(Boolean)
          .map((line: string) => {
            const [year, price] = line.split(/[,:\s]+/);
            return {
              year: Number(year),
              pricePerSqFt: Number(price),
            };
          })
          .filter(
            (p: { year: number; pricePerSqFt: number }) =>
              Number.isFinite(p.year) && Number.isFinite(p.pricePerSqFt)
          );

    const doc = await MarketLocation.create({
      ...body,
      slug,
      lat: Number(body.lat) || 0,
      lng: Number(body.lng) || 0,
      changePct: Number(body.changePct) || 0,
      sortOrder: Number(body.sortOrder) || 0,
      series,
    });
    return NextResponse.json({
      item: serializeMarketLocation(doc.toObject() as never),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create location" },
      { status: 500 }
    );
  }
}
