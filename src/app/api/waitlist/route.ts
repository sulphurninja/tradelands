import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { WaitlistEntry } from "@/models/WaitlistEntry";
import { ProjectModel } from "@/models/Project";

const schema = z.object({
  projectSlug: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const session = await getSession();
    await connectDB();

    const project = await ProjectModel.findOne({ slug: body.projectSlug }).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const entry = await WaitlistEntry.create({
      ...body,
      userId: session?.sub,
    });

    return NextResponse.json({ ok: true, id: entry._id.toString() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid details" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to join waitlist" }, { status: 500 });
  }
}
