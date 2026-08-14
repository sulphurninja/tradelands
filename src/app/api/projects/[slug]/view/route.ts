import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/Project";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    await connectDB();
    const doc = await ProjectModel.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { returnDocument: "after" }
    )
      .select("viewCount")
      .lean();

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, viewCount: doc.viewCount || 0 });
  } catch (error) {
    console.error("view error", error);
    return NextResponse.json({ error: "Unable to record view" }, { status: 500 });
  }
}
