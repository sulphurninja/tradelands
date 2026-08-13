import { hashPassword, verifyPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { otpEmailHtml, sendEmail } from "@/lib/email";
import { OtpCode } from "@/models/OtpCode";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueEmailOtp(
  email: string,
  purpose: "verify-email" | "login" = "verify-email"
) {
  await connectDB();
  const normalized = email.toLowerCase().trim();
  const code = generateCode();
  const codeHash = await hashPassword(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OtpCode.deleteMany({ email: normalized, purpose });
  await OtpCode.create({ email: normalized, codeHash, purpose, expiresAt });

  await sendEmail({
    to: normalized,
    subject: "Your TradeLands verification code",
    html: otpEmailHtml(code),
    text: `Your TradeLands verification code is ${code}. Expires in 10 minutes.`,
  });

  return { ok: true as const };
}

export async function verifyEmailOtp(
  email: string,
  code: string,
  purpose: "verify-email" | "login" = "verify-email"
) {
  await connectDB();
  const normalized = email.toLowerCase().trim();
  const doc = await OtpCode.findOne({ email: normalized, purpose }).sort({
    createdAt: -1,
  });
  if (!doc || doc.expiresAt.getTime() < Date.now()) {
    return { ok: false as const, error: "Code expired or not found." };
  }
  const valid = await verifyPassword(code.trim(), doc.codeHash);
  if (!valid) {
    return { ok: false as const, error: "Invalid verification code." };
  }
  await OtpCode.deleteMany({ email: normalized, purpose });
  return { ok: true as const };
}
