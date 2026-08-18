"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import type { MarketIndexItem, MarketLocationItem } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  generateUpwardBandCandles,
  type Candle,
} from "@/lib/market-series";
import {
  getDeskIndexItems,
  getDeskTickerLines,
  getActiveDeskParcels,
} from "@/lib/tradeland-listings";
import { LIVE_MARKET_CORRIDORS } from "@/lib/market-corridors";

const FALLBACK_ITEMS = getDeskIndexItems();

const scrollbarHide =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Maharashtra Land Index board band — static desk guidance. */
const INDEX_BAND = {
  min: 2_500_000, // ₹25 L
  max: 20_000_000, // ₹2 Cr
  label: "₹25 L – ₹2 Cr",
  changePct: 18.4,
} as const;

function formatAxis(v: number) {
  if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(1)}Cr`;
  if (v >= 100_000) return `${Math.round(v / 100_000)}L`;
  return String(Math.round(v));
}

function upwardIndexCandles(points = 30): Candle[] {
  return generateUpwardBandCandles(
    "mh-land-index-up-acre-v4",
    INDEX_BAND.min,
    INDEX_BAND.max,
    points
  );
}

function LiveCandles({
  candles,
  tall,
}: {
  candles: Candle[];
  tall?: boolean;
}) {
  if (!candles.length) return null;

  const pad = { top: 10, right: 6, bottom: tall ? 22 : 4, left: tall ? 44 : 4 };
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
      aria-label="Land rate candlesticks per acre"
    >
      {tall
        ? [0, 0.33, 0.66, 1].map((t) => {
            const val = yMin + ySpan * (1 - t);
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
                  {formatAxis(val)}
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
              strokeWidth={1.25}
              opacity={isLast ? 1 : 0.85}
            />
            <rect
              x={cx - bodyW / 2}
              y={top}
              width={bodyW}
              height={bodyH}
              fill={color}
              opacity={isLast ? 1 : 0.9}
              rx={1}
            />
            {tall && i % labelEvery === 0 ? (
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

function AcrePrice({
  amount,
  size = "lg",
  rangeLabel,
}: {
  amount?: number;
  size?: "lg" | "md";
  /** Static band like "₹25 L – ₹2 Cr" (no live tick). */
  rangeLabel?: string;
}) {
  return (
    <div>
      <p
        className={cn(
          "font-semibold tabular-nums text-white",
          size === "lg" ? "text-2xl sm:text-3xl lg:text-4xl" : "text-[13px] sm:text-sm leading-snug"
        )}
      >
        {rangeLabel ?? (amount != null ? formatINR(amount) : "—")}
      </p>
      <p
        className={cn(
          "font-normal text-white/45",
          size === "lg" ? "mt-0.5 text-sm" : "mt-0.5 text-[10px]"
        )}
      >
        / acre · approx
      </p>
    </div>
  );
}

export function MarketSnapshotStrip({
  items,
  locations: _locations = [],
}: {
  items: MarketIndexItem[];
  locations?: MarketLocationItem[];
}) {
  const [tickerHover, setTickerHover] = useState(false);
  const [tickerLocked, setTickerLocked] = useState(false);
  const tickerPaused = tickerHover || tickerLocked;

  const list = items.length ? items : FALLBACK_ITEMS;
  const headline =
    list.find((i) => i.slug === "maharashtra-land-index") || list[0];

  const roadCorridors = useMemo(
    () =>
      LIVE_MARKET_CORRIDORS.map((c) => ({
        slug: c.slug,
        name: c.boardName,
        rateLabel:
          c.slug === "karjat-khalapur"
            ? "₹50L – ₹2 Cr"
            : c.slug === "pali-khopoli"
              ? "₹40L – ₹1.50 Cr"
              : c.slug === "kolad-roha"
                ? "₹30L – ₹80L"
                : "₹1 Cr – ₹5 Cr",
        changePct: c.changePct,
        candles: generateUpwardBandCandles(
          `board-road-${c.slug}-v4`,
          c.rateMinLakh * 100000,
          c.rateMaxLakh * 100000,
          18
        ),
      })),
    []
  );

  const headlineCandles = useMemo(() => upwardIndexCandles(30), []);

  const tickerLines = useMemo(() => {
    const parcels = getDeskTickerLines().filter(
      (line) => !/khalapur/i.test(line)
    );
    return [...parcels, ...parcels];
  }, []);

  const featured = useMemo(() => getActiveDeskParcels(), []);

  const last = headlineCandles[headlineCandles.length - 1];
  const first = headlineCandles[0];
  const sessionPct = INDEX_BAND.changePct;

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
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              Maharashtra land board
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-white/55">
              Candlestick corridor rates per acre from active inventory — green
              months closed higher, red lower.
            </p>
          </div>
          <p className="text-[11px] tracking-[0.14em] text-white/40 uppercase">
            ₹ / acre · OHLC board
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
                  <AcrePrice rangeLabel={INDEX_BAND.label} />
                </div>
                {last && first ? (
                  <p className="mt-1.5 text-[11px] tabular-nums text-white/40">
                    O {formatINR(first.open)} · H {formatINR(INDEX_BAND.max)} · L{" "}
                    {formatINR(INDEX_BAND.min)} · C {formatINR(last.close)}
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
              <span>Candles</span>
              <span>Close</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {roadCorridors.map((item) => (
              <div
                key={item.slug}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 text-[10px] font-semibold leading-snug tracking-[0.08em] text-white/50 uppercase">
                    {item.name}
                  </p>
                  <ChangeBadge pct={item.changePct} />
                </div>
                <div className="mt-1.5">
                  <AcrePrice rangeLabel={item.rateLabel} size="md" />
                </div>
                <div className="mt-1">
                  <LiveCandles candles={item.candles} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {featured.length ? (
          <div
            className={cn(
              "mt-6 overflow-x-auto overflow-y-hidden",
              scrollbarHide
            )}
          >
            <div>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                Active parcels on the desk
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((p) => (
                  <a
                    key={p.id}
                    href={`/market?location=${p.corridorSlug}`}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition hover:border-emerald-400/40 hover:bg-white/[0.05]"
                  >
                    <p className="truncate text-sm font-semibold text-white">
                      {p.title}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-white/50">
                      <span className="capitalize">{p.type}</span>
                      <span className="tabular-nums text-emerald-300/90">
                        {p.pricePerAcreLabel}
                      </span>
                      <span>{p.district}</span>
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
