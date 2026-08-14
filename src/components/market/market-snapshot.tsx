"use client";

import { useId, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import type { MarketIndexItem, MarketLocationItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { buildIndicativePath } from "@/lib/market-series";

const FALLBACK_ITEMS: MarketIndexItem[] = [
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

function seriesFor(
  item: MarketIndexItem,
  locations: MarketLocationItem[]
): { t: string; v: number }[] {
  const loc = locations.find((l) => l.slug === item.slug);
  const path = buildIndicativePath({
    seed: `desk-${item.slug}`,
    end: item.pricePerSqFt,
    changePct: item.changePct || 10,
    series: loc?.series,
    points: 48,
  });
  return path.map((p) => ({ t: p.label, v: p.value }));
}

function Sparkline({
  data,
  up,
  tall,
}: {
  data: { t: string; v: number }[];
  up: boolean;
  tall?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const stroke = up ? "#34d399" : "#f87171";
  const fillId = `fill-${uid}`;

  return (
    <div className={cn("w-full", tall ? "h-40 sm:h-48" : "h-16")}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin - 12", "dataMax + 12"]} hide />
          <Area
            type="linear"
            dataKey="v"
            stroke={stroke}
            strokeWidth={tall ? 2.25 : 1.5}
            fill={`url(#${fillId})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChangeBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        up
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-red-500/20 text-red-300"
      )}
    >
      {up ? (
        <ArrowUpRight className="size-3.5" />
      ) : (
        <ArrowDownRight className="size-3.5" />
      )}
      {up ? "+" : ""}
      {pct.toFixed(2)}%
    </span>
  );
}

export function MarketSnapshotStrip({
  items,
  locations = [],
}: {
  items: MarketIndexItem[];
  locations?: MarketLocationItem[];
}) {
  const list = items.length ? items : FALLBACK_ITEMS;
  const headline =
    list.find((i) => i.slug === "maharashtra-land-index") || list[0];
  const corridors = list.filter((i) => i.id !== headline.id);

  const headlineSeries = useMemo(
    () => seriesFor(headline, locations),
    [headline, locations]
  );

  const ticker = [...list, ...list];

  return (
    <section
      id="market-snapshot"
      className="scroll-mt-20 overflow-hidden border-y border-border bg-[#0b0f0e] text-[#e8ece9]"
    >
      <div className="relative border-b border-white/10 bg-black/40">
        <div className="flex overflow-hidden py-2.5">
          <div className="animate-market-ticker flex w-max gap-8 px-4 text-[11px] font-medium tracking-[0.06em] uppercase whitespace-nowrap">
            {ticker.map((item, i) => {
              const up = item.changePct >= 0;
              return (
                <span
                  key={`${item.id}-${i}`}
                  className="inline-flex items-center gap-2"
                >
                  <span className="text-white/50">{item.name}</span>
                  <span className="tabular-nums text-white/90">
                    ₹{item.pricePerSqFt}
                  </span>
                  <span
                    className={cn(
                      "tabular-nums",
                      up ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {up ? "▲" : "▼"} {Math.abs(item.changePct).toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-premium section-pad py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-emerald-400/90 uppercase">
              <Activity className="size-3.5" />
              Market open · Indicative
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              TradeLands desk
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-white/55">
              Live corridor indices with price charts — land, spoken like a
              trading terminal.
            </p>
          </div>
          <p className="text-[11px] tracking-[0.14em] text-white/40 uppercase">
            ₹ / sq.ft · YoY change
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/45 uppercase">
                  {headline.name}
                </p>
                <p className="mt-2 text-3xl font-semibold tabular-nums text-white sm:text-4xl">
                  ₹{headline.pricePerSqFt}
                  <span className="ml-2 text-base font-normal text-white/45">
                    / sq.ft
                  </span>
                </p>
              </div>
              <ChangeBadge pct={headline.changePct} />
            </div>
            <div className="mt-4">
              <Sparkline
                data={headlineSeries}
                up={headline.changePct >= 0}
                tall
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] tracking-[0.12em] text-white/35 uppercase">
              <span>2023</span>
              <span>Price path</span>
              <span>2026</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {corridors.slice(0, 4).map((item) => {
              const up = item.changePct >= 0;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                      {item.name}
                    </p>
                    <ChangeBadge pct={item.changePct} />
                  </div>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-white">
                    ₹{item.pricePerSqFt}
                  </p>
                  <div className="mt-1">
                    <Sparkline
                      data={seriesFor(item, locations)}
                      up={up}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {corridors.length > 4 ? (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {corridors.slice(4).map((item) => {
              const up = item.changePct >= 0;
              return (
                <div
                  key={item.id}
                  className="min-w-[200px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                      {item.name}
                    </p>
                    <ChangeBadge pct={item.changePct} />
                  </div>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-white">
                    ₹{item.pricePerSqFt}
                  </p>
                  <Sparkline data={seriesFor(item, locations)} up={up} />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
