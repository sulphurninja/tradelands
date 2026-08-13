"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  mode: "login" | "register";
}

function roleHome(role?: string) {
  if (role === "superadmin") return "/super-admin";
  if (role === "admin") return "/admin";
  if (role === "sales") return "/crm";
  return "/dashboard";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pendingEmail, setPendingEmail] = useState("");

  async function finishAuth(user: { role?: string }) {
    toast.success(mode === "login" ? "Welcome back" : "Account ready");
    const explicitNext = searchParams.get("next");
    router.push(explicitNext || roleHome(user.role));
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      if (step === "otp") {
        const code = String(form.get("code") || "");
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: pendingEmail,
            code,
            purpose: "verify-email",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Invalid code");
          return;
        }
        await finishAuth(data.user || {});
        return;
      }

      const payload =
        mode === "login"
          ? {
              email: String(form.get("email")),
              password: String(form.get("password")),
            }
          : {
              name: String(form.get("name")),
              email: String(form.get("email")),
              phone: String(form.get("phone") || ""),
              password: String(form.get("password")),
            };

      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 403 && data.needsVerification) {
        setPendingEmail(data.email || payload.email);
        await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email || payload.email,
            purpose: "verify-email",
          }),
        });
        setStep("otp");
        toast.message("Enter the OTP sent to your email");
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      if (data.needsVerification) {
        setPendingEmail(data.email || payload.email);
        setStep("otp");
        toast.message("Check your email for the verification code");
        return;
      }

      await finishAuth(data.user || {});
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (!pendingEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, purpose: "verify-email" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not resend");
        return;
      }
      toast.success("Code resent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {step === "otp" ? (
        <>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{pendingEmail}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="code">Verification code</Label>
            <Input
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              minLength={4}
              maxLength={8}
              placeholder="123456"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full gradient-emerald text-white dark:text-white"
          >
            {loading ? "Verifying…" : "Verify & continue"}
          </Button>
          <button
            type="button"
            onClick={resendOtp}
            className="w-full text-center text-sm text-primary"
          >
            Resend code
          </button>
        </>
      ) : (
        <>
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Min. 8 characters"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full gradient-emerald text-white dark:text-white"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New investor?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </>
            ) : (
              <>
                Already registered?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </>
            )}
          </p>
        </>
      )}
    </form>
  );
}
