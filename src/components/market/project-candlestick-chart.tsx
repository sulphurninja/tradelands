"use client";

import { useMemo } from "react";
import type { MarketLocationItem, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  buildIndicativePath,
  closesToCandles,
  type Candle,
} from "@/lib/market-series";

function buildCandles(
  project: Project,
  location?: MarketLocationItem | null
): Candle[] {
  const end =
    project.pricePerSqFt ||
    location?.series?.[location.series.length - 1]?.pricePerSqFt ||
    Math.round(
      project.pricing.minPrice / Math.max(project.area.minGuntha * 1089, 1)
    );
  const changePct =
    project.growthPotentialPct ??
    project.growth3yPct ??
    location?.changePct ??
    14;

  const path = buildIndicativePath({
    seed: `candle-${project.slug || project.id}`,
    end,
    changePct,
    series: location?.series,
    points: 28,
  });

  return closesToCandles(path, `candle-${project.slug || project.id}`);
}

function CandlestickSvg({ candles }: { candles: Candle[] }) {
  const pad = { top: 16, right: 12, bottom: 28, left: 48 };
  const width = 640;
  const height = 280;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const span = Math.max(max - min, 1);
  // Pad domain so flat-ish ranges still breathe
  const yMin = min - span * 0.08;
  const yMax = max + span * 0.08;
  const ySpan = yMax - yMin;

  const y = (v: number) => pad.top + ((yMax - v) / ySpan) * innerH;
  const slot = innerW / candles.length;
  const bodyW = Math.min(14, Math.max(4, slot * 0.55));

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round(yMin + (ySpan * i) / ticks)
  );

  // Label every ~nth candle so x-axis stays readable
  const labelEvery = Math.max(1, Math.ceil(candles.length / 6));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Monthly land rate candlestick chart in rupees per square foot"
    >
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={y(tick)}
            y2={y(tick)}
            className="stroke-border"
            strokeDasharray="3 4"
          />
          <text
            x={pad.left - 8}
            y={y(tick) + 3}
            textAnchor="end"
            className="fill-muted-foreground text-[10px]"
          >
            {tick}
          </text>
        </g>
      ))}
      <text
        x={12}
        y={pad.top + innerH / 2}
        textAnchor="middle"
        transform={`rotate(-90 12 ${pad.top + innerH / 2})`}
        className="fill-muted-foreground text-[9px]"
      >
        ₹ / sq.ft
      </text>

      {candles.map((c, i) => {
        const cx = pad.left + slot * i + slot / 2;
        const up = c.close >= c.open;
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyBot = y(Math.min(c.open, c.close));
        const bodyH = Math.max(bodyBot - bodyTop, 1.5);
        const color = up ? "#10b981" : "#ef4444";

        return (
          <g key={`${c.label}-${i}`}>
            <line
              x1={cx}
              x2={cx}
              y1={y(c.high)}
              y2={y(c.low)}
              stroke={color}
              strokeWidth={1.25}
            />
            <rect
              x={cx - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={color}
              rx={0.5}
            />
            {i % labelEvery === 0 || i === candles.length - 1 ? (
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
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

export function ProjectCandlestickChart({
  project,
  location,
  className,
}: {
  project: Project;
  location?: MarketLocationItem | null;
  className?: string;
}) {
  const candles = useMemo(
    () => buildCandles(project, location),
    [project, location]
  );

  const last = candles[candles.length - 1];
  const first = candles[0];
  const change =
    first && last ? ((last.close - first.open) / first.open) * 100 : 0;
  const up = change >= 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Land rate chart
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
            {project.name} · ₹ / sq.ft
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Each candle is one month of land rate for this asset
            {location ? ` in the ${location.name} corridor` : ""}: green months
            closed higher, red months closed lower. Body = open→close; wicks =
            high & low that month.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            Latest rate
          </p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">
            ₹{last?.close ?? "—"}
            <span className="ml-1 text-sm font-medium text-muted-foreground">
              / sq.ft
            </span>
          </p>
          <p
            className={cn(
              "mt-0.5 text-sm font-semibold tabular-nums",
              up
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {up ? "+" : ""}
            {change.toFixed(2)}% over chart period
          </p>
        </div>
      </div>

      <div className="px-2 pt-2 pb-1 sm:px-4">
        <CandlestickSvg candles={candles} />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border px-4 py-3 sm:grid-cols-4 sm:gap-2 sm:px-6">
        {[
          ["Open", last?.open, "Month start"],
          ["High", last?.high, "Peak rate"],
          ["Low", last?.low, "Floor rate"],
          ["Close", last?.close, "Month end"],
        ].map(([k, v, hint]) => (
          <div key={String(k)}>
            <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              {k}
            </p>
            <p className="mt-0.5 font-semibold tabular-nums">
              ₹{v}
              <span className="font-normal text-muted-foreground"> /sq.ft</span>
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
