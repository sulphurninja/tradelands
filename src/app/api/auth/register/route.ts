import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { isEmailOtpEnabled } from "@/lib/email-otp-flag";
import { issueEmailOtp } from "@/lib/otp";
import { getSiteConfig } from "@/lib/platform-settings";
import { User } from "@/models/User";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const site = await getSiteConfig();
    if (!site.allowRegistrations) {
      return NextResponse.json(
        { error: "New registrations are currently closed." },
        { status: 403 }
      );
    }

    await connectDB();

    const email = data.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const otpOn = isEmailOtpEnabled();
    const passwordHash = await hashPassword(data.password);
    const user = await User.create({
      name: data.name,
      email,
      phone: data.phone,
      passwordHash,
      role: "customer",
      active: true,
      emailVerified: !otpOn,
      phoneVerified: false,
      wishlist: [],
    });

    if (otpOn) {
      await issueEmailOtp(email, "verify-email");
      return NextResponse.json({
        needsVerification: true,
        email: user.email,
        message: "Account created. Enter the OTP sent to your email.",
      });
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
        emailVerified: true,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid registration details.", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Unable to register right now." },
      { status: 500 }
    );
  }
}
