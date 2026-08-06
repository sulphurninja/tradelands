import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  projectSlug: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await connectDB();
    const lead = await Lead.create({
      ...data,
      email: data.email || undefined,
      source: data.source || "website",
    });

    return NextResponse.json({
      ok: true,
      id: lead._id.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please fill the required fields." },
        { status: 400 }
      );
    }
    console.error("Lead error:", error);
    return NextResponse.json(
      { error: "Unable to submit enquiry right now." },
      { status: 500 }
    );
  }
}
