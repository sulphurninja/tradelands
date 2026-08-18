import data from "@/lib/data/tradeland-listings.json";
import type { MarketIndexItem, MarketLocationItem } from "@/lib/types";

export type TradelandAsset = (typeof data.assets)[number];
export type TradelandCorridor = (typeof data.corridors)[number];

/** Live board corridors only — excludes Khalapur / Panvel / Daund desk leftovers. */
const LIVE_BOARD_CORRIDORS = [
  {
    slug: "karjat-khalapur",
    boardName: "Karjat–Khalapur Rd",
    rateMinLakh: 50,
    rateMaxLakh: 200,
    changePct: 18.5,
  },
  {
    slug: "pali-khopoli",
    boardName: "Pali–Khopoli Rd",
    rateMinLakh: 40,
    rateMaxLakh: 150,
    changePct: 15.2,
  },
  {
    slug: "kolad-roha",
    boardName: "Kolad–Roha Rd",
    rateMinLakh: 30,
    rateMaxLakh: 80,
    changePct: 12.4,
  },
  {
    slug: "lonavala-khandala",
    boardName: "Lonavala–Khandala Rd",
    rateMinLakh: 100,
    rateMaxLakh: 500,
    changePct: 16.8,
  },
] as const;

export function getTradelandAssets(): TradelandAsset[] {
  return data.assets;
}

export function getTradelandCorridors(): TradelandCorridor[] {
  return data.corridors;
}

/** Desk strip / index — Maharashtra index + 4 live road corridors only. */
export function getDeskIndexItems(): MarketIndexItem[] {
  const items: MarketIndexItem[] = [
    {
      id: "tl-mh",
      name: data.index.name,
      slug: "maharashtra-land-index",
      pricePerSqFt: data.index.pricePerSqFt,
      pricePerAcre: 2_500_000,
      changePct: data.index.changePct,
      sortOrder: 0,
      featured: true,
      active: true,
    },
  ];

  LIVE_BOARD_CORRIDORS.forEach((c, i) => {
    const midLakh = Math.round((c.rateMinLakh + c.rateMaxLakh) / 2);
    items.push({
      id: `tl-${c.slug}`,
      name: c.boardName,
      slug: c.slug,
      pricePerSqFt: Math.max(1, Math.round((midLakh * 100000) / 43560)),
      pricePerAcre: midLakh * 100000,
      changePct: c.changePct,
      sortOrder: i + 1,
      featured: true,
      active: true,
    });
  });

  return items;
}

/** Synthetic yearly series for the 4 live corridors — ₹ / acre. */
export function getDeskLocations(): MarketLocationItem[] {
  return LIVE_BOARD_CORRIDORS.map((c, i) => {
    const end = c.rateMaxLakh * 100000;
    const start = c.rateMinLakh * 100000;
    const mid1 = Math.round(start + (end - start) * 0.33);
    const mid2 = Math.round(start + (end - start) * 0.66);
    return {
      id: `tl-loc-${c.slug}`,
      name: c.boardName,
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

export type ActiveDeskParcel = {
  id: string;
  title: string;
  acres: number;
  location: string;
  type: "agriculture" | "residential";
  pricePerAcreLabel: string;
  district: string;
  corridorSlug: string;
};

/** Fixed desk board parcels (client-specified inventory highlights). */
export function getActiveDeskParcels(): ActiveDeskParcel[] {
  return [
    {
      id: "desk-pali-90",
      title: "90 Acres · Pali",
      acres: 90,
      location: "Pali",
      type: "agriculture",
      pricePerAcreLabel: "₹40L – ₹1.50 Cr/acre",
      district: "Raigad",
      corridorSlug: "pali-khopoli",
    },
    {
      id: "desk-karjat-res-50",
      title: "50 Acres · Karjat",
      acres: 50,
      location: "Karjat",
      type: "residential",
      pricePerAcreLabel: "₹50L – ₹2 Cr/acre",
      district: "Raigad",
      corridorSlug: "karjat-khalapur",
    },
    {
      id: "desk-karjat-agri-100",
      title: "100 Acres · Karjat",
      acres: 100,
      location: "Karjat",
      type: "agriculture",
      pricePerAcreLabel: "₹50L – ₹2 Cr/acre",
      district: "Raigad",
      corridorSlug: "karjat-khalapur",
    },
    {
      id: "desk-roha-160",
      title: "160 Acres · Roha",
      acres: 160,
      location: "Roha",
      type: "agriculture",
      pricePerAcreLabel: "₹30L – ₹80L/acre",
      district: "Raigad",
      corridorSlug: "kolad-roha",
    },
    {
      id: "desk-khopoli-80",
      title: "80 Acres · Khopoli",
      acres: 80,
      location: "Khopoli",
      type: "agriculture",
      pricePerAcreLabel: "₹40L – ₹1.50 Cr/acre",
      district: "Raigad",
      corridorSlug: "pali-khopoli",
    },
    {
      id: "desk-kolad-140",
      title: "140 Acres · Kolad",
      acres: 140,
      location: "Kolad",
      type: "agriculture",
      pricePerAcreLabel: "₹30L – ₹80L/acre",
      district: "Raigad",
      corridorSlug: "kolad-roha",
    },
    {
      id: "desk-khandala-60",
      title: "60 Acres · Khandala",
      acres: 60,
      location: "Khandala",
      type: "agriculture",
      pricePerAcreLabel: "₹1 Cr – ₹5 Cr/acre",
      district: "Pune",
      corridorSlug: "lonavala-khandala",
    },
  ];
}

export function getFeaturedTradelandParcels(limit = 6): TradelandAsset[] {
  const priced = data.assets.filter((a) => a.pricePerAcreLabel);
  const rest = data.assets.filter((a) => !a.pricePerAcreLabel && a.acres);
  return [...priced, ...rest].slice(0, limit);
}
