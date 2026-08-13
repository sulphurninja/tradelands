import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeProject } from "@/lib/serialize";
import { ProjectModel } from "@/models/Project";
import { User } from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.sub).select("wishlist").lean();
  const slugs = ((user?.wishlist || []) as string[]).map(String);
  const docs = slugs.length
    ? await ProjectModel.find({ slug: { $in: slugs } }).lean()
    : [];
  const bySlug = new Map(
    docs.map((d) => [String(d.slug), serializeProject(d as never)])
  );

  return NextResponse.json({
    slugs,
    projects: slugs.map((s) => bySlug.get(s)).filter(Boolean),
  });
}

const mutateSchema = z.object({
  projectSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const body = mutateSchema.parse(await request.json());
    await connectDB();
    const project = await ProjectModel.findOne({
      slug: body.projectSlug,
    }).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const user = await User.findById(session.sub);
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const list = (user.wishlist || []) as string[];
    if (!list.includes(body.projectSlug)) {
      list.push(body.projectSlug);
      user.wishlist = list;
      await user.save();
    }

    return NextResponse.json({ ok: true, wishlist: user.wishlist });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    console.error("wishlist POST", error);
    return NextResponse.json({ error: "Unable to save." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const body = mutateSchema.parse(await request.json());
    await connectDB();
    const user = await User.findById(session.sub);
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    user.wishlist = ((user.wishlist || []) as string[]).filter(
      (s: string) => s !== body.projectSlug
    );
    await user.save();

    return NextResponse.json({ ok: true, wishlist: user.wishlist });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    console.error("wishlist DELETE", error);
    return NextResponse.json({ error: "Unable to update." }, { status: 500 });
  }
}
