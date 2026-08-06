import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getSiteConfig } from "@/lib/platform-settings";
import { SiteVisit } from "@/models/SiteVisit";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  projectSlug: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  pickupRequired: z.boolean().optional(),
  pickupAddress: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const site = await getSiteConfig();
    if (!site.enableSiteVisits) {
      return NextResponse.json(
        { error: "Site visit booking is temporarily unavailable." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = schema.parse(body);
    const session = await getSession();

    await connectDB();
    const visit = await SiteVisit.create({
      ...data,
      email: data.email || undefined,
      userId: session?.sub,
      pickupRequired: data.pickupRequired ?? false,
    });

    return NextResponse.json({
      ok: true,
      id: visit._id.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please complete the site visit form." },
        { status: 400 }
      );
    }
    console.error("Site visit error:", error);
    return NextResponse.json(
      { error: "Unable to book site visit right now." },
      { status: 500 }
    );
  }
}
