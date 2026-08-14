"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import type { MarketIndexItem, MarketLocationItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  buildIndicativePath,
  closesToCandles,
  type Candle,
} from "@/lib/market-series";
import {
  pulseSeries,
  useLivePricePulse,
} from "@/hooks/use-live-price-pulse";
import {
  getDeskIndexItems,
  getDeskLocations,
  getDeskTickerLines,
  getFeaturedTradelandParcels,
} from "@/lib/tradeland-listings";

const FALLBACK_ITEMS = getDeskIndexItems();
const FALLBACK_LOCATIONS = getDeskLocations();

const scrollbarHide =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function candlesFor(
  item: MarketIndexItem,
  locations: MarketLocationItem[],
  points = 28
): Candle[] {
  const loc = locations.find((l) => l.slug === item.slug);
  const path = buildIndicativePath({
    seed: `desk-candle-${item.slug}`,
    end: item.pricePerSqFt,
    changePct: item.changePct || 10,
    series: loc?.series,
    points,
  });
  return closesToCandles(path, `desk-candle-${item.slug}`);
}

function LiveCandles({
  candles,
  tall,
}: {
  candles: Candle[];
  tall?: boolean;
}) {
  if (!candles.length) return null;

  const pad = { top: 10, right: 6, bottom: tall ? 22 : 4, left: tall ? 36 : 4 };
  const width = tall ? 640 : 280;
  const height = tall ? 220 : 72;
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
  const bodyW = Math.min(tall ? 12 : 7, Math.max(2.5, slot * 0.55));
  const labelEvery = Math.max(1, Math.ceil(candles.length / 5));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-auto w-full", tall ? "min-h-[180px]" : "min-h-[64px]")}
      role="img"
      aria-label="Live land rate candlesticks"
    >
      {tall
        ? [0, 0.33, 0.66, 1].map((t) => {
            const val = Math.round(yMin + ySpan * (1 - t));
            const yy = y(val);
            return (
              <g key={t}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={yy}
                  y2={yy}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 4"
                />
                <text
                  x={pad.left - 6}
                  y={yy + 3}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.35)"
                  fontSize={9}
                >
                  {val}
                </text>
              </g>
            );
          })
        : null}

      {candles.map((c, i) => {
        const cx = pad.left + slot * i + slot / 2;
        const up = c.close >= c.open;
        const color = up ? "#34d399" : "#f87171";
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
              strokeWidth={isLast ? 1.75 : 1.15}
              opacity={isLast ? 1 : 0.85}
            />
            <rect
              x={cx - bodyW / 2}
              y={top}
              width={bodyW}
              height={bodyH}
              fill={color}
              rx={0.5}
              opacity={isLast ? 1 : 0.9}
            />
            {isLast ? (
              <circle
                cx={cx}
                cy={y(c.close)}
                r={tall ? 3.5 : 2.5}
                fill={color}
                className="animate-pulse"
              />
            ) : null}
            {tall && (i % labelEvery === 0 || isLast) ? (
              <text
                x={cx}
                y={height - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize={8}
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

function LivePrice({
  base,
  factor,
  delta,
  tick,
  size = "lg",
}: {
  base: number;
  factor: number;
  delta: number;
  tick: number;
  size?: "lg" | "md";
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const price = Math.max(1, Math.round(base * factor));

  useEffect(() => {
    if (!tick || delta === 0) return;
    setFlash(delta > 0 ? "up" : "down");
    const id = window.setTimeout(() => setFlash(null), 900);
    return () => window.clearTimeout(id);
  }, [tick, delta]);

  return (
    <p
      className={cn(
        "font-semibold tabular-nums transition-colors duration-500",
        size === "lg" ? "text-3xl sm:text-4xl" : "text-lg",
        flash === "up" && "text-emerald-300",
        flash === "down" && "text-red-300",
        !flash && "text-white"
      )}
    >
      ₹{price}
      {size === "lg" ? (
        <span className="ml-2 text-base font-normal text-white/45">/ sq.ft</span>
      ) : null}
    </p>
  );
}

export function MarketSnapshotStrip({
  items,
  locations = [],
}: {
  items: MarketIndexItem[];
  locations?: MarketLocationItem[];
}) {
  const pulse = useLivePricePulse(true);
  const [tickerHover, setTickerHover] = useState(false);
  const [tickerLocked, setTickerLocked] = useState(false);
  const tickerPaused = tickerHover || tickerLocked;

  const list = items.length ? items : FALLBACK_ITEMS;
  const locs = locations.length ? locations : FALLBACK_LOCATIONS;
  const headline =
    list.find((i) => i.slug === "maharashtra-land-index") || list[0];
  const corridors = list.filter((i) => i.id !== headline.id);

  const headlineCandles = useMemo(() => {
    const base = candlesFor(headline, locs, 30);
    return pulseSeries(base, pulse.factor, ["open", "high", "low", "close"]);
  }, [headline, locs, pulse.factor]);

  const tickerLines = useMemo(() => {
    const parcels = getDeskTickerLines();
    return [...parcels, ...parcels];
  }, []);

  const featured = useMemo(() => getFeaturedTradelandParcels(6), []);

  const last = headlineCandles[headlineCandles.length - 1];
  const first = headlineCandles[0];
  const sessionPct =
    first && last ? ((last.close - first.open) / first.open) * 100 : headline.changePct;

  return (
    <section
      id="market-snapshot"
      className="scroll-mt-20 overflow-hidden border-y border-border bg-[#0b0f0e] text-[#e8ece9]"
    >
      <div className="relative border-b border-white/10 bg-black/40">
        <div
          className="flex cursor-default overflow-hidden py-2.5"
          onMouseEnter={() => setTickerHover(true)}
          onMouseLeave={() => {
            setTickerHover(false);
            setTickerLocked(false);
          }}
          onClick={() => setTickerLocked((v) => !v)}
          onTouchStart={() => setTickerHover(true)}
          onTouchEnd={() => {
            setTickerHover(false);
            setTickerLocked(false);
          }}
          role="presentation"
          title={
            tickerPaused
              ? "Click or leave to resume"
              : "Hover or click to pause"
          }
        >
          <div
            className={cn(
              "animate-market-ticker flex w-max gap-8 px-4 text-[11px] font-medium tracking-[0.04em] uppercase whitespace-nowrap",
              tickerPaused && "[animation-play-state:paused]"
            )}
            data-paused={tickerPaused ? "true" : "false"}
          >
            {tickerLines.map((line, i) => (
              <span
                key={`${line}-${i}`}
                className="inline-flex items-center gap-2 text-white/80"
              >
                <span className="size-1 rounded-full bg-emerald-400/80" />
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-premium section-pad py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-emerald-400/90 uppercase">
              <Activity className="size-3.5" />
              Live inventory · TradeLands desk
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300 normal-case tracking-normal">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                ticking
              </span>
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              Maharashtra land board
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-white/55">
              Candlestick corridor rates from active inventory — green months
              closed higher, red lower. Live tip moves every few seconds.
            </p>
          </div>
          <p className="text-[11px] tracking-[0.14em] text-white/40 uppercase">
            ₹ / sq.ft · OHLC board
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/45 uppercase">
                  {headline.name}
                </p>
                <div className="mt-2">
                  <LivePrice
                    base={headline.pricePerSqFt}
                    factor={pulse.factor}
                    delta={pulse.delta}
                    tick={pulse.tick}
                  />
                </div>
                {last ? (
                  <p className="mt-1.5 text-[11px] tabular-nums text-white/40">
                    O {last.open} · H {last.high} · L {last.low} · C {last.close}
                  </p>
                ) : null}
              </div>
              <ChangeBadge pct={sessionPct} />
            </div>
            <div className="mt-4">
              <LiveCandles candles={headlineCandles} tall />
            </div>
            <div className="mt-2 flex justify-between text-[10px] tracking-[0.12em] text-white/35 uppercase">
              <span>Open</span>
              <span>Live candle tip</span>
              <span>Close</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {corridors.slice(0, 4).map((item) => {
              const phase =
                1 +
                ((item.sortOrder % 3) - 1) *
                  0.006 *
                  (pulse.delta >= 0 ? 1 : -1);
              const factor = pulse.factor * phase;
              const candles = pulseSeries(
                candlesFor(item, locs, 18),
                factor,
                ["open", "high", "low", "close"]
              );
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                      {item.name}
                    </p>
                    <ChangeBadge
                      pct={item.changePct + (factor - 1) * 100 * 0.45}
                    />
                  </div>
                  <div className="mt-1.5">
                    <LivePrice
                      base={item.pricePerSqFt}
                      factor={factor}
                      delta={pulse.delta}
                      tick={pulse.tick}
                      size="md"
                    />
                  </div>
                  <div className="mt-1">
                    <LiveCandles candles={candles} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {featured.length || corridors.length > 4 ? (
          <div
            className={cn(
              "mt-6 overflow-x-auto overflow-y-hidden",
              scrollbarHide
            )}
          >
            {featured.length ? (
              <div>
                <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                  Active parcels on the desk
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((p) => {
                    const slug = `tl-${String(p.leadNo || "01").padStart(2, "0")}-${p.location
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}`;
                    return (
                      <a
                        key={p.id}
                        href={`/projects/${slug}`}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition hover:border-emerald-400/40 hover:bg-white/[0.05]"
                      >
                        <p className="truncate text-sm font-semibold text-white">
                          {p.title}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-white/50">
                          <span className="capitalize">
                            {p.type.replace("-", " ")}
                          </span>
                          {p.pricePerAcreLabel ? (
                            <span className="tabular-nums text-emerald-300/90">
                              {p.pricePerAcreLabel}
                            </span>
                          ) : null}
                          {p.district ? <span>{p.district}</span> : null}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {corridors.length > 4 ? (
              <div
                className={cn(
                  "mt-4 flex gap-3 overflow-x-auto pb-1",
                  scrollbarHide
                )}
              >
                {corridors.slice(4).map((item) => {
                  const candles = pulseSeries(
                    candlesFor(item, locs, 16),
                    pulse.factor,
                    ["open", "high", "low", "close"]
                  );
                  return (
                    <div
                      key={item.id}
                      className="min-w-[210px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                          {item.name}
                        </p>
                        <ChangeBadge pct={item.changePct} />
                      </div>
                      <div className="mt-1.5">
                        <LivePrice
                          base={item.pricePerSqFt}
                          factor={pulse.factor}
                          delta={pulse.delta}
                          tick={pulse.tick}
                          size="md"
                        />
                      </div>
                      <LiveCandles candles={candles} />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
