"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import type { MarketLocationItem } from "@/lib/types";
import { FormSelect } from "@/components/ui/form-select";
import { generateUpwardBandCandles, type Candle } from "@/lib/market-series";
import { LIVE_MARKET_CORRIDORS } from "@/lib/market-corridors";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

function formatAxis(v: number) {
  if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(1)}Cr`;
  if (v >= 100_000) return `${Math.round(v / 100_000)}L`;
  return String(Math.round(v));
}

function corridorBand(slug: string, location?: MarketLocationItem) {
  const c = LIVE_MARKET_CORRIDORS.find((x) => x.slug === slug);
  if (c) {
    return {
      min: c.rateMinLakh * 100000,
      max: c.rateMaxLakh * 100000,
      label: c.rateLabel.replace(" / acre", ""),
      changePct: c.changePct,
      live: true as const,
    };
  }
  const series = location?.series || [];
  const end = series.at(-1)?.pricePerSqFt || 5_000_000;
  const start = series[0]?.pricePerSqFt || Math.round(end / 1.15);
  return {
    min: Math.min(start, end),
    max: Math.max(start, end),
    label: `${formatINR(Math.min(start, end))} – ${formatINR(Math.max(start, end))}`,
    changePct: location?.changePct ?? 10,
    live: false as const,
  };
}

function PerformanceCandles({ candles }: { candles: Candle[] }) {
  if (!candles.length) return null;

  const pad = { top: 16, right: 16, bottom: 28, left: 52 };
  const width = 720;
  const height = 300;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const span = Math.max(max - min, 1);
  const yMin = min - span * 0.1;
  const yMax = max + span * 0.1;
  const ySpan = yMax - yMin;

  const y = (v: number) => pad.top + ((yMax - v) / ySpan) * innerH;
  const slot = innerW / candles.length;
  const bodyW = Math.min(14, Math.max(4, slot * 0.55));
  const labelEvery = Math.max(1, Math.ceil(candles.length / 6));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => yMin + ySpan * (1 - t));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full min-h-[240px] w-full sm:min-h-[280px]"
      role="img"
      aria-label="Corridor land rate candlestick chart per acre"
    >
      {ticks.map((val) => {
        const yy = y(val);
        return (
          <g key={val}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={yy}
              y2={yy}
              className="stroke-border"
              strokeDasharray="4 4"
            />
            <text
              x={pad.left - 8}
              y={yy + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {formatAxis(val)}
            </text>
          </g>
        );
      })}

      <text
        x={14}
        y={pad.top + innerH / 2}
        textAnchor="middle"
        transform={`rotate(-90 14 ${pad.top + innerH / 2})`}
        className="fill-muted-foreground"
        fontSize={9}
      >
        ₹ / acre
      </text>

      {candles.map((c, i) => {
        const cx = pad.left + slot * i + slot / 2;
        const up = c.close >= c.open;
        const color = up ? "#10b981" : "#f43f5e";
        const top = y(Math.max(c.open, c.close));
        const bot = y(Math.min(c.open, c.close));
        const bodyH = Math.max(bot - top, 1.5);
        const isLast = i === candles.length - 1;

        return (
          <g key={`${c.label}-${i}`}>
            <line
              x1={cx}
              x2={cx}
              y1={y(c.high)}
              y2={y(c.low)}
              stroke={color}
              strokeWidth={isLast ? 1.75 : 1.25}
            />
            <rect
              x={cx - bodyW / 2}
              y={top}
              width={bodyW}
              height={bodyH}
              fill={color}
              rx={0.75}
            />
            {i % labelEvery === 0 || isLast ? (
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={9}
              >
                {c.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function LandPerformanceChart({
  locations,
}: {
  locations: MarketLocationItem[];
}) {
  const [slug, setSlug] = useState<string>(
    LIVE_MARKET_CORRIDORS[0]?.slug || locations[0]?.slug || ""
  );

  const ordered = useMemo(() => {
    const bySlug = new Map(locations.map((l) => [l.slug, l]));
    const liveFirst = LIVE_MARKET_CORRIDORS.map((c) => bySlug.get(c.slug)).filter(
      (l): l is MarketLocationItem => Boolean(l)
    );
    const liveSlugs = new Set<string>(LIVE_MARKET_CORRIDORS.map((c) => c.slug));
    const rest = locations.filter((l) => !liveSlugs.has(l.slug));
    return [...liveFirst, ...rest];
  }, [locations]);

  const selected = useMemo(
    () => ordered.find((l) => l.slug === slug) || ordered[0],
    [ordered, slug]
  );

  const band = useMemo(
    () => corridorBand(selected?.slug || "", selected),
    [selected]
  );

  const candles = useMemo(() => {
    if (!selected) return [];
    return generateUpwardBandCandles(
      `perf-acre-up-${selected.slug}-v4`,
      band.min,
      band.max,
      32
    );
  }, [selected, band.min, band.max]);

  if (!ordered.length || !selected) return null;

  const last = candles[candles.length - 1];
  const first = candles[0];
  const sessionPct = band.changePct;
  const up = sessionPct >= 0;

  return (
    <section className="container-premium section-pad py-14 sm:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            <Activity className="size-3.5" />
            Land performance
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            {selected.name} Land Index
          </h2>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>Corridor land rate · ₹ / acre</span>
            <span className="font-semibold tabular-nums text-foreground">
              {band.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums",
                up
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {up ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {up ? "+" : ""}
              {sessionPct.toFixed(2)}%
            </span>
          </p>
        </div>
        <div className="w-full sm:w-64">
          <FormSelect
            value={selected.slug}
            onValueChange={setSlug}
            options={ordered.map((l) => {
              const isLive = LIVE_MARKET_CORRIDORS.some((c) => c.slug === l.slug);
              return {
                value: l.slug,
                label: isLive ? l.name : `${l.name} · soon`,
              };
            })}
          />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-3 sm:grid-cols-4 sm:px-6">
          {[
            ["Open", first?.open ?? band.min],
            ["High", band.max],
            ["Low", band.min],
            ["Close", last?.close ?? band.max],
          ].map(([k, v]) => (
            <div key={String(k)}>
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {k}
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {typeof v === "number" ? formatINR(v) : "—"}
                <span className="font-normal text-muted-foreground"> /acre</span>
              </p>
            </div>
          ))}
        </div>

        <div className="px-2 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3">
          <PerformanceCandles candles={candles} />
        </div>

        <p className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground sm:px-6">
          Monthly OHLC for {selected.name} · rates per acre. Green closed higher
          than open; red closed lower. Approx corridor band {band.label} / acre.
        </p>
      </div>
    </section>
  );
}
