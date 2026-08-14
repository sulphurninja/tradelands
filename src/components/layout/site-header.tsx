"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/brand/site-logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserRole } from "@/lib/types";

type MeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function navActive(pathname: string, href: string) {
  const base = href.split("?")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

function portalHome(role: UserRole) {
  switch (role) {
    case "superadmin":
      return "/super-admin";
    case "admin":
      return "/admin";
    case "sales":
      return "/crm";
    default:
      return "/dashboard";
  }
}

function portalLabel(role: UserRole) {
  switch (role) {
    case "superadmin":
      return "Console";
    case "admin":
      return "Admin";
    case "sales":
      return "CRM";
    default:
      return "Dashboard";
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return (data.user as MeUser) || null;
      })
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const accountHref = user ? portalHome(user.role) : "/login";
  const accountLabel = user ? portalLabel(user.role) : "Login";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 text-foreground backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <div className="flex min-w-0 items-center gap-2">
            <SiteLogo priority />
          </div>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 items-center rounded-md px-3 text-[12px] font-semibold tracking-[0.14em] uppercase transition-colors",
                  navActive(pathname, item.href)
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {mounted && (
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden size-9 items-center justify-center rounded-full text-foreground/70 hover:bg-muted sm:inline-flex"
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            )}

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden h-9 text-[12px] font-semibold tracking-[0.12em] uppercase md:inline-flex"
            >
              <Link href={accountHref} prefetch={false}>
                {user ? (
                  <span className="inline-flex items-center gap-1.5">
                    <LayoutDashboard className="size-3.5" />
                    {accountLabel}
                  </span>
                ) : (
                  "Login"
                )}
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="hidden h-9 rounded-full bg-primary px-4 text-[12px] font-semibold tracking-[0.1em] text-primary-foreground uppercase hover:bg-primary/90 sm:inline-flex"
            >
              <Link href="/market">
                Start Investing
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted xl:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                showCloseButton
                className="w-full max-w-none gap-0 border-l border-border bg-background p-0 sm:max-w-md"
              >
                <SheetHeader className="border-b border-border px-5 py-4 pr-14 text-left">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SiteLogo />
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col">
                  <nav className="flex-1 overflow-y-auto px-3 py-3">
                    {NAV_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "mb-1 flex h-12 items-center rounded-2xl px-3 text-[13px] font-semibold tracking-[0.14em] uppercase transition-colors",
                          navActive(pathname, item.href)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto space-y-3 border-t border-border bg-muted/40 px-4 py-4">
                    {user ? (
                      <div className="rounded-xl border border-border bg-background px-3 py-2.5">
                        <p className="truncate text-sm font-semibold">
                          {user.name || user.email}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-full"
                      >
                        <Link
                          href={accountHref}
                          prefetch={false}
                          onClick={() => setOpen(false)}
                        >
                          {accountLabel}
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link href="/market" onClick={() => setOpen(false)}>
                          Start Investing
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                    <p className="text-center text-[11px] text-muted-foreground">
                      {SITE.domain}
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
