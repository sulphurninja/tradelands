import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeBlog } from "@/lib/serialize";
import { Blog } from "@/models/Blog";
import { slugify } from "@/lib/format";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await Blog.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json({ blogs: docs.map((d) => serializeBlog(d as never)) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const body = await request.json();
    const slug = body.slug || slugify(body.title || "post");
    const doc = await Blog.create({
      ...body,
      slug,
      publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10),
    });
    return NextResponse.json({ blog: serializeBlog(doc.toObject() as never) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create blog" }, { status: 500 });
  }
}
