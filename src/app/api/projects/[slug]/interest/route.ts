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
    const project = await ProjectModel.findOne({ slug });
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (session?.sub) {
      const existing = await ProjectInterest.findOne({
        userId: session.sub,
        projectSlug: slug,
      });
      if (existing) {
        return NextResponse.json({
          ok: true,
          interestCount: project.interestCount || 0,
          already: true,
        });
      }
    }

    await ProjectInterest.create({
      userId: session?.sub,
      projectSlug: slug,
      name: body.name || session?.name,
      email: body.email || session?.email,
      phone: body.phone,
    });

    project.interestCount = (project.interestCount || 0) + 1;
    await project.save();

    return NextResponse.json({
      ok: true,
      interestCount: project.interestCount,
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
