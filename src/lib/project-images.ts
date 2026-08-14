/** Verified Unsplash covers for land / villa / industrial assets. */
export const LAND_IMAGES = {
  agriculture: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  ],
  residential: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
  ],
  industrial: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
  ],
  scenic: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  ],
} as const;

export const DEFAULT_LAND_IMAGE = LAND_IMAGES.agriculture[0];

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type ImageBucket = keyof typeof LAND_IMAGES;

export function imageBucketFor(category?: string, typeHint?: string): ImageBucket {
  const t = (typeHint || category || "").toLowerCase();
  if (t.includes("industrial") || t.includes("warehouse")) return "industrial";
  if (
    t.includes("villa") ||
    t.includes("residential") ||
    t.includes("na-villa") ||
    t.includes("farm-house")
  ) {
    return "residential";
  }
  if (t.includes("lake") || t.includes("hill") || t.includes("scenic")) {
    return "scenic";
  }
  return "agriculture";
}

export function pickProjectCover(
  seed: string,
  category?: string,
  typeHint?: string
) {
  const bucket = imageBucketFor(category, typeHint);
  const list = LAND_IMAGES[bucket];
  return list[hash(seed) % list.length]!;
}

export function pickProjectGallery(
  seed: string,
  category?: string,
  typeHint?: string,
  count = 4
) {
  const bucket = imageBucketFor(category, typeHint);
  const primary = LAND_IMAGES[bucket];
  const pool = [...primary, ...LAND_IMAGES.scenic, ...LAND_IMAGES.agriculture];
  const start = hash(`${seed}-g`) % pool.length;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const url = pool[(start + i * 3) % pool.length]!;
    if (!out.includes(url)) out.push(url);
  }
  return out;
}

/** Absolute fallbacks if a remote URL 404s in the browser. */
export const COVER_FALLBACKS = [
  ...LAND_IMAGES.agriculture,
  ...LAND_IMAGES.residential,
  ...LAND_IMAGES.industrial,
  "/images/land-fallback.svg",
];
