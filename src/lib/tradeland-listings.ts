import data from "@/lib/data/tradeland-listings.json";
import type { MarketIndexItem, MarketLocationItem } from "@/lib/types";

export type TradelandAsset = (typeof data.assets)[number];
export type TradelandCorridor = (typeof data.corridors)[number];

export function getTradelandAssets(): TradelandAsset[] {
  return data.assets;
}

export function getTradelandCorridors(): TradelandCorridor[] {
  return data.corridors;
}

/** Desk strip / index fallbacks built from real Excel inventory. */
export function getDeskIndexItems(): MarketIndexItem[] {
  const items: MarketIndexItem[] = [
    {
      id: "tl-mh",
      name: data.index.name,
      slug: "maharashtra-land-index",
      pricePerSqFt: data.index.pricePerSqFt,
      changePct: data.index.changePct,
      sortOrder: 0,
      featured: true,
      active: true,
    },
  ];

  data.corridors.forEach((c, i) => {
    const pps =
      c.avgPricePerSqFt ??
      Math.max(80, Math.round(data.index.pricePerSqFt * (0.7 + (i % 5) * 0.08)));
    items.push({
      id: `tl-${c.slug}`,
      name: c.name,
      slug: c.slug,
      pricePerSqFt: pps,
      changePct: c.changePct,
      sortOrder: i + 1,
      featured: true,
      active: true,
    });
  });

  return items;
}

/** Synthetic yearly series anchors from corridor averages (for charts). */
export function getDeskLocations(): MarketLocationItem[] {
  return data.corridors.map((c, i) => {
    const end =
      c.avgPricePerSqFt ??
      Math.max(80, Math.round(data.index.pricePerSqFt * (0.7 + (i % 5) * 0.08)));
    const start = Math.round(end / (1 + c.changePct / 100));
    const mid1 = Math.round(start + (end - start) * 0.33);
    const mid2 = Math.round(start + (end - start) * 0.66);
    return {
      id: `tl-loc-${c.slug}`,
      name: c.name,
      slug: c.slug,
      lat: 18.5 + i * 0.05,
      lng: 73.2 + i * 0.04,
      changePct: c.changePct,
      series: [
        { year: 2023, pricePerSqFt: start },
        { year: 2024, pricePerSqFt: mid1 },
        { year: 2025, pricePerSqFt: mid2 },
        { year: 2026, pricePerSqFt: end },
      ],
      sortOrder: i,
      active: true,
    };
  });
}

/** Compact ticker lines from real parcels. */
export function getDeskTickerLines(): string[] {
  const lines: string[] = [];
  for (const a of data.assets) {
    if (!a.acres && !a.pricePerAcreLabel) continue;
    const bits = [a.location];
    if (a.acres) bits.push(`${a.acres} Ac`);
    if (a.pricePerAcreLabel) bits.push(a.pricePerAcreLabel);
    else if (a.pricePerSqFt) bits.push(`₹${a.pricePerSqFt}/sq.ft`);
    bits.push(a.type === "industrial" ? "Industrial" : a.type === "residential" ? "R-Zone" : "Agri");
    lines.push(bits.join(" · "));
  }
  // pad with corridor summaries
  for (const c of data.corridors) {
    lines.push(
      `${c.name} desk · ${c.count} parcels · ${c.totalAcres || "—"} Ac inventory`
    );
  }
  return lines;
}

export function getFeaturedTradelandParcels(limit = 6): TradelandAsset[] {
  const priced = data.assets.filter((a) => a.pricePerAcreLabel);
  const rest = data.assets.filter((a) => !a.pricePerAcreLabel && a.acres);
  return [...priced, ...rest].slice(0, limit);
}
