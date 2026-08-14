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
    <nav aria-label="Location corridor" className="space-y-0">
      <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        Corridor path
      </p>
      {ordered.map((loc, i) => {
        const active = activeSlug === loc.slug;
        return (
          <div key={loc.id} className="relative flex gap-3">
            <div className="flex w-4 flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 size-2.5 rounded-full border-2 border-foreground",
                  active && "bg-foreground"
                )}
              />
              {i < ordered.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-foreground/30" />
              ) : null}
            </div>
            <Link
              href={`${baseHref}?location=${loc.slug}`}
              className={cn(
                "mb-3 text-sm font-semibold tracking-[0.1em] uppercase transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {loc.name}
            </Link>
          </div>
        );
      })}
      <p className="pt-2 text-xs text-muted-foreground">
        Click a location → assets appear.
      </p>
    </nav>
  );
}
