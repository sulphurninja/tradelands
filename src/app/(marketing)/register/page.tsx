import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="container-premium section-pad flex min-h-[80vh] items-center justify-center py-28">
      <div className="w-full max-w-md">
        <p className="text-[0.7rem] tracking-[0.28em] text-primary uppercase">
          Create Account
        </p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">
          Join TradeLands
        </h1>
        <p className="mt-3 text-muted-foreground">
          Save projects, book visits, and manage your land investments.
        </p>
        <div className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-8">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
            <AuthForm mode="register" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
