"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MarketCorridorOption } from "@/lib/market-corridors";

export function LocationPath({
  corridors,
  activeSlug,
  baseHref = "/market",
  preserveParams,
}: {
  corridors: MarketCorridorOption[];
  activeSlug?: string;
  baseHref?: string;
  /** Extra query params kept on location links (e.g. bulk=1). */
  preserveParams?: Record<string, string>;
}) {
  const live = corridors.filter((c) => !c.comingSoon);
  const soon = corridors.filter((c) => c.comingSoon);

  function hrefFor(location?: string) {
    const params = new URLSearchParams(preserveParams || {});
    if (location) params.set("location", location);
    else params.delete("location");
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  }

  return (
    <nav
      aria-label="Locations"
      className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Locations
        </p>
        {activeSlug ? (
          <Link
            href={hrefFor()}
            className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            All
          </Link>
        ) : null}
      </div>

      <ul className="space-y-1">
        {live.map((loc) => {
          const active = activeSlug === loc.slug;
          return (
            <li key={loc.slug}>
              <Link
                href={hrefFor(loc.slug)}
                className={cn(
                  "block rounded-lg px-2.5 py-2 text-sm transition",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{loc.name}</span>
                  {loc.changePct != null ? (
                    <span
                      className={cn(
                        "shrink-0 text-[11px] tabular-nums",
                        active ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {loc.changePct >= 0 ? "+" : ""}
                      {loc.changePct.toFixed(1)}%
                    </span>
                  ) : null}
                </span>
                {loc.rateLabel ? (
                  <span
                    className={cn(
                      "mt-0.5 block text-[10px] leading-snug",
                      active ? "text-background/65" : "text-muted-foreground/80"
                    )}
                  >
                    {loc.rateLabel}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {soon.length ? (
        <div className="mt-4 border-t border-border/70 pt-3">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Coming soon
          </p>
          <ul className="space-y-0.5">
            {soon.map((loc) => (
              <li key={loc.slug}>
                <div className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground/70">
                  <span className="truncate font-medium">{loc.name}</span>
                  <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.08em] uppercase">
                    Soon
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
