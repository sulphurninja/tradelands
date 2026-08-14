import { ArrowUpRight } from "lucide-react";
import type { MarketIndexItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK: MarketIndexItem[] = [
  {
    id: "fb-mh",
    name: "Maharashtra Land Index",
    slug: "maharashtra-land-index",
    pricePerSqFt: 286,
    changePct: 12.84,
    sortOrder: 0,
    featured: true,
    active: true,
  },
  {
    id: "fb-karjat",
    name: "Karjat",
    slug: "karjat",
    pricePerSqFt: 320,
    changePct: 18.2,
    sortOrder: 1,
    featured: true,
    active: true,
  },
  {
    id: "fb-roha",
    name: "Roha",
    slug: "roha",
    pricePerSqFt: 200,
    changePct: 14.6,
    sortOrder: 2,
    featured: true,
    active: true,
  },
  {
    id: "fb-alibaug",
    name: "Alibaug",
    slug: "alibaug",
    pricePerSqFt: 410,
    changePct: 11.8,
    sortOrder: 3,
    featured: true,
    active: true,
  },
  {
    id: "fb-khalapur",
    name: "Khalapur",
    slug: "khalapur",
    pricePerSqFt: 245,
    changePct: 9.4,
    sortOrder: 4,
    featured: true,
    active: true,
  },
  {
    id: "fb-panvel",
    name: "Panvel",
    slug: "panvel",
    pricePerSqFt: 380,
    changePct: 7.9,
    sortOrder: 5,
    featured: true,
    active: true,
  },
];

export function TradeLandsIndexPanel({
  items,
  className,
  layout = "stack",
}: {
  items: MarketIndexItem[];
  className?: string;
  /** `rail` = full-width desk strip; `stack` = sidebar list */
  layout?: "stack" | "rail";
}) {
  const list = items.length ? items : FALLBACK;
  const headline =
    list.find((i) => i.slug === "maharashtra-land-index") || list[0];
  const corridors = list.filter((i) => i.id !== headline.id).slice(0, 6);

  if (layout === "rail") {
    return (
      <aside
        className={cn(
          "rounded-2xl border border-border bg-card px-5 py-5 sm:px-7 sm:py-6",
          className
        )}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          <div className="shrink-0 lg:w-56 xl:w-64">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground underline decoration-foreground/30 underline-offset-4 uppercase">
              TradeLands Index
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {headline.name}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-3xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              +{headline.changePct.toFixed(2)}%
              <ArrowUpRight className="size-6" />
            </p>
            <p className="mt-3 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              Updated today · Indicative
            </p>
          </div>

          <ul className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-5 sm:grid-cols-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            {corridors.map((row) => (
              <li key={row.id} className="min-w-0">
                <p className="truncate text-sm font-medium">{row.name}</p>
                <p className="mt-1 inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  +{row.changePct.toFixed(1)}%
                  <ArrowUpRight className="size-3.5" />
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                  ₹{row.pricePerSqFt}/sq.ft
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-6 sm:p-7",
        className
      )}
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground underline decoration-foreground/30 underline-offset-4 uppercase">
        TradeLands Index
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Maharashtra Land Index
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-3xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
        +{headline.changePct.toFixed(2)}%
        <ArrowUpRight className="size-6" />
      </p>
      <ul className="mt-6 space-y-3 border-t border-border pt-5">
        {corridors.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="font-medium">{row.name}</span>
            <span className="inline-flex items-center gap-0.5 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              +{row.changePct.toFixed(1)}%
              <ArrowUpRight className="size-3.5" />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        Updated today · Indicative
      </p>
    </aside>
  );
}
