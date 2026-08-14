"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MarketLocationItem } from "@/lib/types";
import { FormSelect } from "@/components/ui/form-select";
import { buildIndicativePath } from "@/lib/market-series";

export function LandPerformanceChart({
  locations,
}: {
  locations: MarketLocationItem[];
}) {
  const [slug, setSlug] = useState(locations[0]?.slug || "");
  const selected = useMemo(
    () => locations.find((l) => l.slug === slug) || locations[0],
    [locations, slug]
  );

  const data = useMemo(() => {
    if (!selected) return [];
    const end =
      selected.series?.[selected.series.length - 1]?.pricePerSqFt || 250;
    return buildIndicativePath({
      seed: `perf-${selected.slug}`,
      end,
      changePct: selected.changePct || 12,
      series: selected.series,
      points: 36,
    }).map((p) => ({
      label: p.label,
      price: p.value,
    }));
  }, [selected]);

  if (!locations.length || !selected) return null;

  const labelEvery = Math.max(1, Math.ceil(data.length / 6));

  return (
    <section className="container-premium section-pad py-14 sm:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Land performance
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            {selected.name} Land Index
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Corridor land rate · ₹ / sq.ft
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

      <div className="mt-8 h-64 rounded-2xl border border-border bg-card p-4 sm:h-80 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval={0}
              tickFormatter={(v, i) =>
                i % labelEvery === 0 || i === data.length - 1 ? String(v) : ""
              }
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={["dataMin - 20", "dataMax + 20"]}
              label={{
                value: "₹ / SQ.FT",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11 },
              }}
            />
            <Tooltip
              formatter={(value) => [`₹ ${value} / sq.ft`, "Price"]}
              labelFormatter={(label) => String(label)}
            />
            <Line
              type="linear"
              dataKey="price"
              stroke="currentColor"
              className="text-foreground"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
