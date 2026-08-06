import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeReview } from "@/lib/serialize";
import { Review } from "@/models/Review";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await Review.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    reviews: docs.map((d) => serializeReview(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const doc = await Review.create(body);
    return NextResponse.json({
      review: serializeReview(doc.toObject() as never),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create review" },
      { status: 500 }
    );
  }
}
