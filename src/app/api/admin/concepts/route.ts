import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeConcept } from "@/lib/serialize";
import { Concept } from "@/models/Concept";
import { slugify } from "@/lib/format";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await Concept.find().lean();
  return NextResponse.json({
    concepts: docs.map((d) => serializeConcept(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const slug = body.slug || slugify(body.name || "concept");
    const doc = await Concept.create({ ...body, slug });
    return NextResponse.json({
      concept: serializeConcept(doc.toObject() as never),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create concept" },
      { status: 500 }
    );
  }
}
