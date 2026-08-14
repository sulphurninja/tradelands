"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import type { MarketLocationItem } from "@/lib/types";
import { FormSelect } from "@/components/ui/form-select";
import {
  buildIndicativePath,
  closesToCandles,
  type Candle,
} from "@/lib/market-series";
import {
  pulseSeries,
  useLivePricePulse,
} from "@/hooks/use-live-price-pulse";
import { cn } from "@/lib/utils";

function PerformanceCandles({ candles }: { candles: Candle[] }) {
  if (!candles.length) return null;

  const pad = { top: 16, right: 16, bottom: 28, left: 48 };
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
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) =>
    Math.round(yMin + ySpan * (1 - t))
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full min-h-[240px] w-full sm:min-h-[280px]"
      role="img"
      aria-label="Live corridor land rate candlestick chart"
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
              {val}
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
        ₹ / sq.ft
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
            {isLast ? (
              <circle
                cx={cx}
                cy={y(c.close)}
                r={4}
                fill={color}
                className="animate-pulse"
              />
            ) : null}
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

function LiveRate({
  value,
  delta,
  tick,
}: {
  value: number;
  delta: number;
  tick: number;
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!tick || delta === 0) return;
    setFlash(delta > 0 ? "up" : "down");
    const id = window.setTimeout(() => setFlash(null), 900);
    return () => window.clearTimeout(id);
  }, [tick, delta]);

  return (
    <span
      className={cn(
        "font-semibold tabular-nums transition-colors duration-500",
        flash === "up" && "text-emerald-600 dark:text-emerald-400",
        flash === "down" && "text-red-600 dark:text-red-400",
        !flash && "text-foreground"
      )}
    >
      ₹{value}
    </span>
  );
}

export function LandPerformanceChart({
  locations,
}: {
  locations: MarketLocationItem[];
}) {
  const [slug, setSlug] = useState(locations[0]?.slug || "");
  const pulse = useLivePricePulse(true);
  const selected = useMemo(
    () => locations.find((l) => l.slug === slug) || locations[0],
    [locations, slug]
  );

  const candles = useMemo(() => {
    if (!selected) return [];
    const end =
      selected.series?.[selected.series.length - 1]?.pricePerSqFt || 250;
    const path = buildIndicativePath({
      seed: `perf-candle-${selected.slug}`,
      end,
      changePct: selected.changePct || 12,
      series: selected.series,
      points: 32,
    });
    const base = closesToCandles(path, `perf-candle-${selected.slug}`);
    return pulseSeries(base, pulse.factor, ["open", "high", "low", "close"]);
  }, [selected, pulse.factor]);

  if (!locations.length || !selected) return null;

  const last = candles[candles.length - 1];
  const first = candles[0];
  const sessionPct =
    first && last
      ? ((last.close - first.open) / first.open) * 100
      : selected.changePct;
  const up = sessionPct >= 0;

  return (
    <section className="container-premium section-pad py-14 sm:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            <Activity className="size-3.5" />
            Land performance · live
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-normal text-emerald-700 normal-case dark:text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              ticking
            </span>
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            {selected.name} Land Index
          </h2>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>Corridor land rate · ₹ / sq.ft</span>
            {last ? (
              <LiveRate
                value={last.close}
                delta={pulse.delta}
                tick={pulse.tick}
              />
            ) : null}
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
        <div className="w-full sm:w-56">
          <FormSelect
            value={selected.slug}
            onValueChange={setSlug}
            options={locations.map((l) => ({
              value: l.slug,
              label: l.name,
            }))}
          />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-3 sm:grid-cols-4 sm:px-6">
          {[
            ["Open", last?.open],
            ["High", last?.high],
            ["Low", last?.low],
            ["Close", last?.close],
          ].map(([k, v]) => (
            <div key={String(k)}>
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                {k}
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                ₹{v ?? "—"}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  /sq.ft
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="px-2 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3">
          <PerformanceCandles candles={candles} />
        </div>

        <p className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground sm:px-6">
          Monthly OHLC for {selected.name}. Green closed higher than open; red
          closed lower. Live tip moves every few seconds.
        </p>
      </div>
    </section>
  );
}
