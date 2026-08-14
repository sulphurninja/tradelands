import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ProjectInterest } from "@/models/ProjectInterest";
import { ProjectModel } from "@/models/Project";

interface Props {
  params: Promise<{ slug: string }>;
}

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10).optional(),
});

export async function POST(request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const body = schema.parse(await request.json().catch(() => ({})));
    const session = await getSession();

    await connectDB();

    const exists = await ProjectModel.exists({ slug });
    if (!exists) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (session?.sub) {
      const existing = await ProjectInterest.findOne({
        userId: session.sub,
        projectSlug: slug,
      })
        .select("_id")
        .lean();
      if (existing) {
        const project = await ProjectModel.findOne({ slug })
          .select("interestCount")
          .lean();
        return NextResponse.json({
          ok: true,
          interestCount: project?.interestCount || 0,
          already: true,
        });
      }
    }

    try {
      await ProjectInterest.create({
        userId: session?.sub,
        projectSlug: slug,
        name: body.name || session?.name,
        email: body.email || session?.email,
        phone: body.phone,
      });
    } catch (err) {
      // Duplicate key for logged-in user
      const code = (err as { code?: number })?.code;
      if (code === 11000 && session?.sub) {
        const project = await ProjectModel.findOne({ slug })
          .select("interestCount")
          .lean();
        return NextResponse.json({
          ok: true,
          interestCount: project?.interestCount || 0,
          already: true,
        });
      }
      throw err;
    }

    // Atomic update — avoid full document save (corrupt nested fields)
    const updated = await ProjectModel.findOneAndUpdate(
      { slug },
      { $inc: { interestCount: 1 } },
      { returnDocument: "after" }
    )
      .select("interestCount")
      .lean();

    return NextResponse.json({
      ok: true,
      interestCount: updated?.interestCount || 1,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid details." }, { status: 400 });
    }
    console.error("interest error", error);
    return NextResponse.json(
      { error: "Unable to record interest." },
      { status: 500 }
    );
  }
}
