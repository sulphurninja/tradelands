import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ProjectRating } from "@/models/ProjectRating";
import { ProjectModel } from "@/models/Project";

interface Props {
  params: Promise<{ slug: string }>;
}

const schema = z.object({
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: Request, { params }: Props) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in to rate." }, { status: 401 });
    }

    const { slug } = await params;
    const body = schema.parse(await request.json());

    await connectDB();

    const exists = await ProjectModel.exists({ slug });
    if (!exists) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    await ProjectRating.findOneAndUpdate(
      { userId: session.sub, projectSlug: slug },
      {
        $set: {
          userId: session.sub,
          projectSlug: slug,
          rating: body.rating,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const stats = await ProjectRating.aggregate([
      { $match: { projectSlug: slug } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingAvg = Number((stats[0]?.avg || body.rating).toFixed(2));
    const ratingCount = stats[0]?.count || 1;

    await ProjectModel.updateOne(
      { slug },
      { $set: { ratingAvg, ratingCount } }
    );

    return NextResponse.json({
      ok: true,
      ratingAvg,
      ratingCount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    }
    console.error("rate error", error);
    return NextResponse.json(
      { error: "Unable to save rating." },
      { status: 500 }
    );
  }
}
