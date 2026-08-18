import { NextResponse } from "next/server";
import { z } from "zod";
import { issueEmailOtp } from "@/lib/otp";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    await issueEmailOtp(parsed.data.email, "sale-land");

    return NextResponse.json({
      ok: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("sale-land send-otp error:", error);
    return NextResponse.json(
      { error: "Could not send verification code. Please try again." },
      { status: 500 }
    );
  }
}
