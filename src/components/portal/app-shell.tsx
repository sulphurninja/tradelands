"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { UserRole } from "@/lib/types";
import { getPortalConfig, roleLabel } from "@/lib/portal-nav";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/dashboard/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SiteLogo } from "@/components/brand/site-logo";
import { NotificationBell } from "@/components/portal/notification-bell";

type PortalUser = {
  name: string;
  email: string;
  role: UserRole;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: ReturnType<typeof getPortalConfig>["nav"];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1 p-3">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors",
              active
                ? "bg-primary/12 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: PortalUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const config = useMemo(() => getPortalConfig(user.role), [user.role]);

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const items: { label: string; href: string }[] = [];
    let acc = "";
    for (const part of parts) {
      acc += `/${part}`;
      items.push({
        label: part.replace(/-/g, " "),
        href: acc,
      });
    }
    return items;
  }, [pathname]);

  const profileHref =
    config.key === "superadmin"
      ? "/super-admin/profile"
      : config.key === "admin"
        ? "/admin/profile"
        : config.key === "sales"
          ? "/crm/profile"
          : "/dashboard/profile";

  const brand =
    config.key === "superadmin"
      ? "Super"
      : config.key === "admin"
        ? "Admin"
        : config.key === "sales"
          ? "Agent"
          : "Portal";

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-background">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border bg-card lg:flex">
          <div className="flex h-16 items-center gap-2 border-b border-border px-4">
            <SiteLogo href={config.homeHref} />
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {brand}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <p className="px-5 pb-2 text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
              Navigation
            </p>
            <NavList items={config.nav} pathname={pathname} />
          </div>
          <div className="space-y-1 border-t border-border p-3">
            <Link
              href="/"
              className="flex h-10 items-center gap-2 rounded-lg bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <Home className="size-4" />
              Home / Public site
            </Link>
            <Link
              href="/projects"
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              Browse projects
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background lg:hidden">
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SheetHeader className="border-b border-border px-4 py-4 text-left">
                    <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                      <SiteLogo href={config.homeHref} />
                      <span className="text-muted-foreground">{brand}</span>
                    </SheetTitle>
                  </SheetHeader>
                  <NavList
                    items={config.nav}
                    pathname={pathname}
                    onNavigate={() => setOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              <div className="hidden min-w-0 flex-1 md:block">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {crumbs.map((crumb, i) => (
                    <span key={crumb.href} className="flex items-center gap-1.5">
                      {i > 0 && <ChevronRight className="size-3.5 opacity-50" />}
                      <Link
                        href={crumb.href}
                        className={cn(
                          "capitalize transition-colors hover:text-foreground",
                          i === crumbs.length - 1 &&
                            "font-medium text-foreground"
                        )}
                      >
                        {crumb.label}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative ml-auto hidden w-full max-w-[240px] lg:block">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search…"
                  className="h-10 border-border/80 bg-background pl-9"
                />
              </div>

              <NotificationBell />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                <Sun className="size-4 dark:hidden" />
                <Moon className="hidden size-4 dark:block" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border bg-background py-1 pr-2.5 pl-1 transition-colors hover:bg-muted">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/15 text-xs text-primary">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block truncate text-sm font-medium leading-none">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="mt-1 block text-[11px] leading-none text-muted-foreground">
                      {roleLabel(user.role)}
                    </span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(profileHref)}>
                    Profile & settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/")}>
                    Public website
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      void logoutAction();
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
