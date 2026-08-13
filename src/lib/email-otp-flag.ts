/** Flip on with EMAIL_OTP_ENABLED=true once Resend (or SMTP) credentials are live. */
export function isEmailOtpEnabled() {
  return process.env.EMAIL_OTP_ENABLED === "true";
}
