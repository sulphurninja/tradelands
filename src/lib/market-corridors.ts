import type { MarketLocationItem } from "@/lib/types";
import { getDeskLocations } from "@/lib/tradeland-listings";

/** Live market corridors — only these are filterable today. */
export const LIVE_MARKET_CORRIDORS = [
  {
    slug: "karjat-khalapur",
    name: "Karjat–Khalapur Rd",
    boardName: "Karjat–Khalapur Rd",
    aliases: ["karjat", "khalapur"],
    /** Approx desk rate per acre */
    rateMinLakh: 50,
    rateMaxLakh: 200,
    rateLabel: "₹50L – ₹2 Cr / acre",
    changePct: 18.5,
    comingSoon: false as const,
  },
  {
    slug: "pali-khopoli",
    name: "Pali–Khopoli Rd",
    boardName: "Pali–Khopoli Rd",
    aliases: ["pali", "khopoli"],
    rateMinLakh: 40,
    rateMaxLakh: 150,
    rateLabel: "₹40L – ₹1.50 Cr / acre",
    changePct: 15.2,
    comingSoon: false as const,
  },
  {
    slug: "kolad-roha",
    name: "Kolad–Roha Rd",
    boardName: "Kolad–Roha Rd",
    aliases: ["kolad", "roha"],
    rateMinLakh: 30,
    rateMaxLakh: 80,
    rateLabel: "₹30L – ₹80L / acre",
    changePct: 12.4,
    comingSoon: false as const,
  },
  {
    slug: "lonavala-khandala",
    name: "Lonavala–Khandala Rd",
    boardName: "Lonavala–Khandala Rd",
    aliases: ["lonavala", "khandala"],
    rateMinLakh: 100,
    rateMaxLakh: 500,
    rateLabel: "₹1 Cr – ₹5 Cr / acre",
    changePct: 16.8,
    comingSoon: false as const,
  },
] as const;

/** Other desk corridors shown as coming soon. */
export const COMING_SOON_CORRIDORS = [
  { slug: "panvel", name: "Panvel", aliases: ["panvel"] },
  { slug: "daund", name: "Daund", aliases: ["daund"] },
  { slug: "chandrapur", name: "Chandrapur", aliases: ["chandrapur"] },
  { slug: "chandkhed", name: "Chandkhed", aliases: ["chandkhed"] },
  { slug: "nashik", name: "Nashik", aliases: ["nashik"] },
  { slug: "bhor", name: "Bhor", aliases: ["bhor"] },
  { slug: "navi-mumbai", name: "Navi Mumbai", aliases: ["navi mumbai", "navi-mumbai"] },
] as const;

export type MarketCorridorOption = {
  slug: string;
  name: string;
  aliases: string[];
  comingSoon: boolean;
  changePct?: number;
  rateLabel?: string;
  rateMinLakh?: number;
  rateMaxLakh?: number;
};

function deskPct(slugOrAlias: string) {
  const desk = getDeskLocations();
  const hit = desk.find(
    (l) =>
      l.slug === slugOrAlias ||
      l.name.toLowerCase() === slugOrAlias.toLowerCase()
  );
  return hit?.changePct ?? 10;
}

/** Sidebar + filter options for /market. */
export function getMarketCorridorOptions(): MarketCorridorOption[] {
  const live: MarketCorridorOption[] = LIVE_MARKET_CORRIDORS.map((c) => ({
    slug: c.slug,
    name: c.name,
    aliases: [...c.aliases],
    comingSoon: false,
    changePct: c.changePct,
    rateLabel: c.rateLabel,
    rateMinLakh: c.rateMinLakh,
    rateMaxLakh: c.rateMaxLakh,
  }));

  const soon: MarketCorridorOption[] = COMING_SOON_CORRIDORS.map((c) => ({
    slug: c.slug,
    name: c.name,
    aliases: [...c.aliases],
    comingSoon: true,
    changePct: deskPct(c.slug),
  }));

  return [...live, ...soon].map((c, i) => ({ ...c, sortHint: i }));
}

/** Locations for charts / dropdowns — 4 live roads first, then other cities. */
export function getMarketLocations(): MarketLocationItem[] {
  const desk = getDeskLocations();

  const live = LIVE_MARKET_CORRIDORS.map((c, i) => {
    const end = c.rateMaxLakh * 100000;
    const start = c.rateMinLakh * 100000;
    const mid1 = Math.round(start + (end - start) * 0.33);
    const mid2 = Math.round(start + (end - start) * 0.66);
    const primary = desk.find((d) => d.slug === c.slug);
    return {
      id: `mkt-${c.slug}`,
      name: c.boardName,
      slug: c.slug,
      lat: primary?.lat ?? 18.5 + i * 0.08,
      lng: primary?.lng ?? 73.2 + i * 0.06,
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

  const soon = COMING_SOON_CORRIDORS.map((c, i) => {
    const end = 5_000_000 + i * 800_000;
    const start = Math.round(end / 1.15);
    return {
      id: `mkt-soon-${c.slug}`,
      name: c.name,
      slug: c.slug,
      lat: 18.4 + i * 0.06,
      lng: 73.1 + i * 0.05,
      changePct: deskPct(c.slug),
      series: [
        { year: 2023, pricePerSqFt: start },
        { year: 2024, pricePerSqFt: Math.round(start + (end - start) * 0.33) },
        { year: 2025, pricePerSqFt: Math.round(start + (end - start) * 0.66) },
        { year: 2026, pricePerSqFt: end },
      ],
      sortOrder: live.length + i,
      active: true,
    };
  });

  return [...live, ...soon];
}

export function findMarketCorridor(slug?: string | null) {
  if (!slug) return null;
  const live = LIVE_MARKET_CORRIDORS.find((c) => c.slug === slug);
  if (live) return { ...live, comingSoon: false as const };
  const soon = COMING_SOON_CORRIDORS.find((c) => c.slug === slug);
  if (soon) return { ...soon, comingSoon: true as const };
  return null;
}

/** Match a project against a corridor slug (pair aliases). */
export function projectMatchesCorridor(
  project: {
    name: string;
    location: {
      village?: string;
      taluka?: string;
      district?: string;
    };
  },
  slug: string
) {
  const corridor =
    LIVE_MARKET_CORRIDORS.find((c) => c.slug === slug) ||
    COMING_SOON_CORRIDORS.find((c) => c.slug === slug);
  // Village only — taluka can collide (e.g. Khopoli sits in Khalapur taluka).
  const village = (project.location.village ?? "").toLowerCase().trim();
  if (corridor) {
    return corridor.aliases.some((a) => village === a.toLowerCase() || village.includes(a.toLowerCase()));
  }
  const hay =
    `${project.location.village} ${project.location.taluka} ${project.location.district} ${project.name}`.toLowerCase();
  return hay.includes(slug.toLowerCase());
}
