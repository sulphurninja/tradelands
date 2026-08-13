import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { isEmailOtpEnabled } from "@/lib/email-otp-flag";
import { issueEmailOtp } from "@/lib/otp";
import { User } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  purpose: z.enum(["verify-email", "login"]).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isEmailOtpEnabled()) {
      return NextResponse.json(
        { error: "Email OTP is not enabled yet." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const data = schema.parse(body);
    const email = data.email.toLowerCase().trim();
    const purpose = data.purpose || "verify-email";

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "If that email is registered, a code was sent.",
      });
    }

    await issueEmailOtp(email, purpose);
    return NextResponse.json({
      ok: true,
      message: "Verification code sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: "Unable to send code right now." },
      { status: 500 }
    );
  }
}
