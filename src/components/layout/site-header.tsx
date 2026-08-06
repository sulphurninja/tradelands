"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  Moon,
  Phone,
  Sun,
  X,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container-premium section-pad">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <Link
            href="/"
            className="relative z-10 flex min-w-0 shrink-0 flex-col justify-center"
          >
            <span
              className={cn(
                "font-display text-[1.5rem] leading-none tracking-[-0.03em] sm:text-[1.7rem]",
                solid ? "text-foreground" : "text-white"
              )}
            >
              Trade<span className="text-gold">Lands</span>
              <span
                className={cn(
                  "ml-0.5 text-[0.68em] font-normal",
                  solid ? "text-primary" : "text-white/80"
                )}
              >
                .IND
              </span>
            </span>
            <span
              className={cn(
                "mt-1 hidden text-[0.62rem] leading-none tracking-[0.18em] uppercase sm:block",
                solid ? "text-muted-foreground" : "text-white/65"
              )}
            >
              Land Investment Portal
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((item) =>
              "children" in item ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-9 items-center gap-1 rounded-md px-3 text-[0.8125rem] font-medium leading-none transition-colors",
                      solid
                        ? "text-foreground/80 hover:text-primary"
                        : "text-white/85 hover:text-white"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="glass min-w-[210px] rounded-xl p-1.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex h-10 items-center rounded-lg px-3 text-sm leading-none text-foreground/85 transition-colors hover:bg-primary/8 hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-[0.8125rem] font-medium leading-none transition-colors",
                    solid
                      ? "text-foreground/80 hover:text-primary"
                      : "text-white/85 hover:text-white",
                    pathname === item.href &&
                      (solid ? "text-primary" : "text-white")
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {mounted && (
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "hidden size-9 items-center justify-center rounded-full border transition-colors sm:inline-flex",
                  solid
                    ? "border-border text-foreground hover:bg-muted"
                    : "border-white/25 text-white hover:bg-white/10"
                )}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            )}

            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className={cn(
                "hidden h-9 items-center gap-2 rounded-md px-2 text-sm leading-none lg:inline-flex",
                solid ? "text-foreground/70" : "text-white/80"
              )}
            >
              <Phone className="size-3.5 shrink-0" />
              <span>{SITE.phone}</span>
            </a>

            <Button
              asChild
              size="sm"
              className="hidden gradient-emerald px-4 text-white shadow-none hover:opacity-95 sm:inline-flex"
            >
              <Link href="/book-site-visit">
                <span>Book Visit</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "hidden md:inline-flex",
                !solid && "text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <Link href="/login" prefetch={false}>
                Login
              </Link>
            </Button>

            <button
              type="button"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border xl:hidden",
                solid
                  ? "border-border text-foreground"
                  : "border-white/30 text-white"
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl xl:hidden">
          <div className="container-premium section-pad max-h-[75vh] space-y-5 overflow-y-auto py-5">
            {NAV_LINKS.map((item) =>
              "children" in item ? (
                <div key={item.label} className="space-y-1">
                  <p className="px-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  <div className="grid">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex h-11 items-center rounded-lg px-3 text-[0.95rem] leading-none text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex h-11 items-center rounded-lg px-3 text-[0.95rem] leading-none"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                asChild
                className="h-11 w-full gradient-emerald text-white"
              >
                <Link href="/book-site-visit">Book Visit</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full">
                <Link href="/register" prefetch={false}>
                  Register
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
