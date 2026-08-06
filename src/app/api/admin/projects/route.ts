import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { serializeProject } from "@/lib/serialize";
import { ProjectModel } from "@/models/Project";
import { slugify } from "@/lib/format";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;
  await connectDB();
  const docs = await ProjectModel.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({
    projects: docs.map((d) => serializeProject(d as never)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = await request.json();
    const slug = body.slug || slugify(body.name || "project");
    const existing = await ProjectModel.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists." },
        { status: 409 }
      );
    }
    const doc = await ProjectModel.create({
      ...body,
      slug,
      pricing: { currency: "INR", ...body.pricing },
    });
    return NextResponse.json({
      project: serializeProject(doc.toObject() as never),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create project" },
      { status: 500 }
    );
  }
}
