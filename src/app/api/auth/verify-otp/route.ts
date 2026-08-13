import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { setAuthCookie, signToken } from "@/lib/auth";
import { isEmailOtpEnabled } from "@/lib/email-otp-flag";
import { verifyEmailOtp } from "@/lib/otp";
import { User } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(8),
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

    const result = await verifyEmailOtp(email, data.code, purpose);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    user.emailVerified = true;
    await user.save();

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: true,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid details." }, { status: 400 });
    }
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: "Unable to verify code." },
      { status: 500 }
    );
  }
}
