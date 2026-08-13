import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { isEmailOtpEnabled } from "@/lib/email-otp-flag";
import { User } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Precomputed bcrypt hash so missing users still pay compare cost.
 * Password is irrelevant — only used when no user row exists.
 */
const DUMMY_HASH =
  "$2b$12$kfw3cXjazleBtnEu0d9wVOQinkF2UD4UNIaguJfmPuiLl0ZikpHKe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const email = data.email.toLowerCase().trim();

    await connectDB();

    const user = await User.findOne({ email });
    const hash = user?.passwordHash || DUMMY_HASH;
    const valid = await verifyPassword(data.password, hash);

    if (!user || !valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.active === false) {
      return NextResponse.json(
        { error: "This account has been deactivated. Contact support." },
        { status: 403 }
      );
    }

    const needsVerify =
      isEmailOtpEnabled() &&
      user.role === "customer" &&
      user.emailVerified !== true;

    if (needsVerify) {
      return NextResponse.json(
        {
          error: "Please verify your email before signing in.",
          needsVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    const token = await signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: Boolean(user.emailVerified),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid login details." },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Unable to login right now." },
      { status: 500 }
    );
  }
}
