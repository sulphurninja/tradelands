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

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
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

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      toast.success(mode === "login" ? "Welcome back" : "Account created");
      const role = data.user?.role as string | undefined;
      const explicitNext = searchParams.get("next");
      let destination = "/dashboard";
      if (role === "superadmin") destination = "/super-admin";
      else if (role === "admin") destination = "/admin";
      else if (role === "sales") destination = "/crm";
      router.push(explicitNext || destination);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
    </form>
  );
}
