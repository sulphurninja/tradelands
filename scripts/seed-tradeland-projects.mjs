/**
 * Upsert Project docs from tradeland-listings.json (Excel inventory).
 * Does not wipe other projects — only upserts by slug `tl-*`.
 *
 * Usage: node scripts/seed-tradeland-projects.mjs
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // rely on process env
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const listings = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/lib/data/tradeland-listings.json"),
    "utf8"
  )
);

const IMAGES = {
  agriculture: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=80",
  ],
  residential: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
  ],
  industrial: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
  ],
};

const COORDS = {
  Daund: [18.4631, 74.3678],
  Karjat: [18.9102, 73.3236],
  Chandrapur: [19.9615, 79.2961],
  Chandkhed: [18.62, 73.55],
  Panvel: [18.9894, 73.1175],
  Nashik: [19.9975, 73.7898],
  Bhor: [18.1486, 73.8433],
  Lonavala: [18.7557, 73.4082],
  Khalapur: [18.8292, 73.2747],
  Roha: [18.4362, 73.1196],
  "Navi Mumbai": [19.033, 73.0297],
};

function pick(arr, i) {
  return arr[i % arr.length];
}

function shufflePick(arr, seed, n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(arr[(seed + i * 3) % arr.length]);
  return [...new Set(out)];
}

function categoryFor(type) {
  if (type === "residential") return "na-villa-plot";
  if (type === "industrial") return "agriculture-land";
  return "agriculture-land";
}

function attrsFor(type, i) {
  if (type === "industrial") {
    return ["road-touch", "highway-access", "clear-title"].slice(0, 2 + (i % 2));
  }
  if (type === "residential") {
    return ["road-touch", "hill-view", "clear-title", "gated"].slice(
      0,
      2 + (i % 3)
    );
  }
  return ["road-touch", "river-touch", "forest", "clear-title"].slice(
    0,
    2 + (i % 3)
  );
}

function projectFromAsset(a, i) {
  const acres = a.acres || 10;
  const lakh = a.pricePerAcreLakh || 60;
  const pricePerAcre = Math.round(lakh * 100000);
  const totalMin = Math.round(pricePerAcre * Math.max(acres * 0.85, 1));
  const totalMax = Math.round(pricePerAcre * acres);
  const guntha = Math.max(1, Math.round(acres * 40));
  const imgs = IMAGES[a.type] || IMAGES.agriculture;
  const cover = pick(imgs, i);
  const gallery = shufflePick(imgs, i, 4);
  const [lat, lng] = COORDS[a.location] || [18.5 + (i % 7) * 0.08, 73.2 + (i % 5) * 0.06];
  const slug = `tl-${String(a.leadNo || i + 1).padStart(2, "0")}-${(a.location || "land")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  return {
    slug,
    name: a.title || `${acres} Acres · ${a.location}`,
    tagline:
      a.pricePerAcreLabel
        ? `${a.location}, ${a.district} · ${a.pricePerAcreLabel}`
        : `${a.location}, ${a.district} · TradeLands desk parcel`,
    category: categoryFor(a.type),
    status: i < 6 ? ["featured", "trending"] : ["featured"],
    developmentStage: i % 2 === 0 ? "developed" : "under-development",
    location: {
      state: "Maharashtra",
      district: a.district || "Maharashtra",
      taluka: a.location,
      village: a.location,
      address: a.summary?.slice(0, 120) || undefined,
      lat: lat + (i % 5) * 0.01,
      lng: lng + (i % 4) * 0.01,
    },
    pricing: {
      currency: "INR",
      minPrice: totalMin,
      maxPrice: totalMax,
      pricePerAcre,
      pricePerGuntha: Math.round(pricePerAcre / 40),
      bookingAmount: Math.min(500000, Math.round(totalMin * 0.02)),
    },
    area: {
      minGuntha: Math.max(1, Math.round(guntha * 0.5)),
      maxGuntha: guntha,
      minAcre: Math.round(acres * 0.5 * 10) / 10,
      maxAcre: acres,
    },
    attributes: attrsFor(a.type, i),
    purposes:
      a.type === "industrial"
        ? ["warehouse", "appreciation"]
        : a.type === "residential"
          ? ["villa", "appreciation"]
          : ["plantation", "farmhouse", "appreciation"],
    coverImage: cover,
    gallery,
    overview: (a.summary || `${a.title} — TradeLands inventory parcel.`).slice(
      0,
      480
    ),
    story:
      "Listed from live TradeLands desk inventory. Rates include desk markup for clear pricing on the board.",
    amenities: [
      { name: "Site visit on request" },
      { name: "Title diligence support" },
      { name: "Corridor market briefing" },
    ],
    highlights: [
      a.pricePerAcreLabel
        ? `Desk rate ${a.pricePerAcreLabel}`
        : "Desk-listed parcel",
      `${a.district || "Maharashtra"} corridor`,
      a.type === "industrial"
        ? "Industrial / logistics use"
        : a.type === "residential"
          ? "Residential / R-zone potential"
          : "Agriculture land",
    ].filter(Boolean),
    connectivity: [
      `${a.location}, ${a.district}`,
      "Maharashtra land desk",
    ],
    documents: [
      { title: "7/12 Extract", type: "7/12", url: "#" },
      { title: "Title Report", type: "title-report", url: "#" },
    ],
    plots: [
      {
        id: `${a.id}-p1`,
        number: "P-01",
        areaGuntha: Math.max(10, Math.round(guntha * 0.35)),
        price: Math.round(totalMin * 0.4),
        status: "available",
        facing: "East",
      },
      {
        id: `${a.id}-p2`,
        number: "P-02",
        areaGuntha: Math.max(10, Math.round(guntha * 0.65)),
        price: Math.round(totalMax * 0.65),
        status: "available",
        facing: "North",
      },
    ],
    appreciation: "Corridor-linked appreciation · indicative",
    legalStatus: "Desk listed · papers on request",
    featured: true,
    listingBadge: i % 4 === 0 ? "premium" : i % 4 === 1 ? "high-demand" : "available",
    pricePerSqFt: a.pricePerSqFt || Math.round(pricePerAcre / 43560),
    growthPotentialPct: 9 + (i % 6) * 1.4,
    investmentHorizon: i % 2 === 0 ? "3-5 years" : "5-8 years",
    growth3yPct: 22 + (i % 8) * 2.5,
    growth5yPct: 40 + (i % 8) * 3.5,
    demandLevel: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
    earlyAccess: false,
    waitlistEnabled: false,
    viewCount: 20 + i * 11,
    interestCount: 3 + (i % 9),
    ratingAvg: 4.1 + (i % 8) * 0.1,
    ratingCount: 2 + (i % 12),
  };
}

async function main() {
  console.log("Connecting…");
  await mongoose.connect(uri);

  const Project =
    mongoose.models.Project ||
    mongoose.model(
      "Project",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

  const assets = listings.assets || [];
  let upserted = 0;

  for (let i = 0; i < assets.length; i++) {
    const doc = projectFromAsset(assets[i], i);
    await Project.findOneAndUpdate(
      { slug: doc.slug },
      { $set: doc },
      { upsert: true, new: true }
    );
    upserted += 1;
  }

  // Align market indices / locations with bumped desk corridors
  const MarketIndex =
    mongoose.models.MarketIndex ||
    mongoose.model(
      "MarketIndex",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );
  const MarketLocation =
    mongoose.models.MarketLocation ||
    mongoose.model(
      "MarketLocation",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

  await MarketIndex.deleteMany({ slug: { $regex: /^(maharashtra-land-index|tl-)/ } });
  // Replace corridor rows by slug from desk
  for (const [i, c] of (listings.corridors || []).entries()) {
    const end = c.avgPricePerSqFt || 200;
    const start = Math.round(end / (1 + (c.changePct || 10) / 100));
    await MarketLocation.findOneAndUpdate(
      { slug: c.slug },
      {
        $set: {
          name: c.name,
          slug: c.slug,
          lat: (COORDS[c.name] || [18.5, 73.2])[0],
          lng: (COORDS[c.name] || [18.5, 73.2])[1],
          changePct: c.changePct || 10,
          sortOrder: i,
          active: true,
          series: [
            { year: 2023, pricePerSqFt: start },
            {
              year: 2024,
              pricePerSqFt: Math.round(start + (end - start) * 0.33),
            },
            {
              year: 2025,
              pricePerSqFt: Math.round(start + (end - start) * 0.66),
            },
            { year: 2026, pricePerSqFt: end },
          ],
        },
      },
      { upsert: true }
    );
    await MarketIndex.findOneAndUpdate(
      { slug: c.slug },
      {
        $set: {
          name: c.name,
          slug: c.slug,
          pricePerSqFt: end,
          changePct: c.changePct || 10,
          sortOrder: i + 1,
          featured: true,
          active: true,
        },
      },
      { upsert: true }
    );
  }

  if (listings.index) {
    await MarketIndex.findOneAndUpdate(
      { slug: "maharashtra-land-index" },
      {
        $set: {
          name: listings.index.name,
          slug: "maharashtra-land-index",
          pricePerSqFt: listings.index.pricePerSqFt,
          changePct: listings.index.changePct,
          sortOrder: 0,
          featured: true,
          active: true,
        },
      },
      { upsert: true }
    );
  }

  console.log(`Upserted ${upserted} TradeLand projects`);
  console.log(`Synced ${listings.corridors?.length || 0} corridors + index`);
  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
