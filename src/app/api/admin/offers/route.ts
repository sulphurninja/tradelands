import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeOffer } from "@/lib/serialize";
import { Offer } from "@/models/Offer";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await Offer.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({
    offers: docs.map((d) => serializeOffer(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const doc = await Offer.create({
      ...body,
      highlights: Array.isArray(body.highlights)
        ? body.highlights.filter(Boolean)
        : String(body.highlights || "")
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean),
    });
    return NextResponse.json({
      offer: serializeOffer(doc.toObject() as never),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create offer" },
      { status: 500 }
    );
  }
}
