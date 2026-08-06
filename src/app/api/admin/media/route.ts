import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeMedia } from "@/lib/serialize";
import { Media } from "@/models/Media";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await Media.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({
    media: docs.map((d) => serializeMedia(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const doc = await Media.create(body);
    return NextResponse.json({ media: serializeMedia(doc.toObject() as never) });
  } catch {
    return NextResponse.json(
      { error: "Unable to create media item" },
      { status: 500 }
    );
  }
}
