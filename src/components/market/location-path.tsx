"use client";

import Link from "next/link";
import type { MarketLocationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LocationPath({
  locations,
  activeSlug,
  baseHref = "/market",
}: {
  locations: MarketLocationItem[];
  activeSlug?: string;
  baseHref?: string;
}) {
  const ordered = [...locations].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <nav
      aria-label="Location corridor"
      className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Corridors
        </p>
        {activeSlug ? (
          <Link
            href={baseHref}
            className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            All
          </Link>
        ) : null}
      </div>
      <ul className="space-y-0.5">
        {ordered.map((loc) => {
          const active = activeSlug === loc.slug;
          return (
            <li key={loc.id}>
              <Link
                href={`${baseHref}?location=${loc.slug}`}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="truncate font-medium">{loc.name}</span>
                <span
                  className={cn(
                    "shrink-0 text-[11px] tabular-nums",
                    active ? "text-background/70" : "text-muted-foreground"
                  )}
                >
                  {loc.changePct >= 0 ? "+" : ""}
                  {loc.changePct.toFixed(1)}%
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
