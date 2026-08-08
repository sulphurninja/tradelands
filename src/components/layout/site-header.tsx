"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  Moon,
  Phone,
  Sun,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
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

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("Invest");

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-background/70 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <SiteLogo priority />

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((item) =>
              "children" in item ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center gap-1.5 rounded-md px-3.5 text-[15px] font-medium tracking-[-0.01em] text-foreground/85 transition-colors hover:text-foreground"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="size-3.5 opacity-50 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[220px] rounded-xl border border-border bg-popover/95 p-1.5 shadow-lg backdrop-blur-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex h-11 items-center rounded-lg px-3 text-[15px] text-foreground/85 transition-colors hover:bg-muted"
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
                    "inline-flex h-11 items-center rounded-md px-3.5 text-[15px] font-medium tracking-[-0.01em] transition-colors",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/85 hover:text-foreground"
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
                className="hidden size-9 items-center justify-center rounded-full text-foreground/70 hover:bg-muted sm:inline-flex"
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
              className="hidden h-9 items-center gap-1.5 px-2 text-[14px] text-foreground/70 lg:inline-flex"
            >
              <Phone className="size-3.5 shrink-0" />
              <span>{SITE.phone}</span>
            </a>

            <Button
              asChild
              size="sm"
              className="hidden h-9 rounded-full bg-primary px-5 text-[14px] font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex"
            >
              <Link href="/book-site-visit">Book Visit</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden h-9 text-[14px] font-medium md:inline-flex"
            >
              <Link href="/login" prefetch={false}>
                Login
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
                <SheetHeader className="border-b border-border px-5 py-4 text-left">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SiteLogo />
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col">
                  <nav className="flex-1 overflow-y-auto px-3 py-3">
                    {NAV_LINKS.map((item) =>
                      "children" in item ? (
                        <div
                          key={item.label}
                          className="mb-1 overflow-hidden rounded-2xl"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded((prev) =>
                                prev === item.label ? null : item.label
                              )
                            }
                            className="flex h-12 w-full items-center justify-between px-3 text-left text-[16px] font-semibold tracking-[-0.01em]"
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={cn(
                                "size-4 text-muted-foreground transition-transform",
                                expanded === item.label && "rotate-180"
                              )}
                            />
                          </button>
                          {expanded === item.label ? (
                            <div className="space-y-0.5 pb-2 pl-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    "flex h-11 items-center rounded-xl px-3 text-[15px] transition-colors",
                                    pathname === child.href
                                      ? "bg-primary/10 font-medium text-primary"
                                      : "text-foreground/80 hover:bg-muted"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "mb-1 flex h-12 items-center rounded-2xl px-3 text-[16px] font-semibold tracking-[-0.01em] transition-colors",
                            pathname === item.href
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          )}
                        >
                          {item.label}
                        </Link>
                      )
                    )}
                  </nav>

                  <div className="mt-auto space-y-3 border-t border-border bg-muted/40 px-4 py-4">
                    <a
                      href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                      className="flex h-11 items-center gap-2 rounded-xl px-2 text-[15px] text-foreground/80"
                    >
                      <Phone className="size-4 text-primary" />
                      {SITE.phone}
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        asChild
                        className="h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link
                          href="/book-site-visit"
                          onClick={() => setOpen(false)}
                        >
                          Book Visit
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-full"
                      >
                        <Link
                          href="/login"
                          prefetch={false}
                          onClick={() => setOpen(false)}
                        >
                          Login
                        </Link>
                      </Button>
                    </div>

                    {mounted ? (
                      <button
                        type="button"
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-[13px] text-muted-foreground hover:bg-muted"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="size-4" /> Light mode
                          </>
                        ) : (
                          <>
                            <Moon className="size-4" /> Dark mode
                          </>
                        )}
                      </button>
                    ) : null}
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
