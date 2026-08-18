/**
 * Redistribute all portal projects into the 4 live corridors (10 each),
 * clamp acre rates to client ranges, and fill Lonavala—Khandala to 10.
 *
 * Usage: node scripts/redistribute-corridor-projects.mjs
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

const CORRIDORS = {
  "karjat-khalapur": {
    name: "Karjat — Khalapur",
    district: "Raigad",
    places: [
      { village: "Karjat", taluka: "Karjat", lat: 18.9102, lng: 73.3236 },
      { village: "Khalapur", taluka: "Khalapur", lat: 18.8292, lng: 73.2747 },
    ],
    rateMinLakh: 60,
    rateMaxLakh: 200,
  },
  "pali-khopoli": {
    name: "Pali — Khopoli",
    district: "Raigad",
    places: [
      { village: "Pali", taluka: "Sudhagad", lat: 18.541, lng: 73.219 },
      { village: "Khopoli", taluka: "Khalapur", lat: 18.7857, lng: 73.3458 },
    ],
    rateMinLakh: 60,
    rateMaxLakh: 160,
  },
  "kolad-roha": {
    name: "Kolad — Roha",
    district: "Raigad",
    places: [
      { village: "Kolad", taluka: "Roha", lat: 18.412, lng: 73.22 },
      { village: "Roha", taluka: "Roha", lat: 18.4362, lng: 73.1196 },
    ],
    rateMinLakh: 30,
    rateMaxLakh: 100,
  },
  "lonavala-khandala": {
    name: "Lonavala — Khandala",
    district: "Pune",
    places: [
      { village: "Lonavala", taluka: "Maval", lat: 18.7557, lng: 73.4082 },
      { village: "Khandala", taluka: "Maval", lat: 18.759, lng: 73.3706 },
    ],
    rateMinLakh: 100,
    rateMaxLakh: 500,
  },
};

/** Prefer natural corridor affinity, then fill to 10 each. */
const ASSIGNMENT = {
  "karjat-khalapur": [
    "the-peak-karjat",
    "meraki-karjat",
    "tl-02-karjat",
    "tl-03-karjat",
    "tl-10-karjat",
    "tl-15-karjat",
    "tl-16-karjat",
    "tl-22-karjat",
    "tl-28-khalapur",
    "tl-36-khalapur",
  ],
  "pali-khopoli": [
    "tl-05-chandkhed",
    "tl-06-panvel",
    "tl-09-panvel",
    "tl-21-panvel",
    "tl-23-karjat",
    "tl-24-karjat",
    "tl-25-panvel",
    "tl-39-panvel",
    "tl-40-navi-mumbai",
    "tl-41-panvel",
  ],
  "kolad-roha": [
    "florave-estate-alibaug",
    "lakeview-na-igatpuri",
    "avenza-grove-nashik",
    "tl-01-daund",
    "tl-04-chandrapur",
    "tl-08-daund",
    "tl-11-bhor",
    "tl-20-karjat",
    "tl-27-karjat",
    "tl-34-roha",
  ],
  "lonavala-khandala": [
    "emerald-acres-mulshi",
    "orlane-villas-lonavala",
    "sahyadri-ridge-satara",
    "tl-07-nashik",
    "tl-12-lonavala",
    "tl-14-lonavala",
  ],
};

const NEW_LONAVALA = [
  {
    slug: "tl-42-khandala",
    name: "18 Acres · Khandala Ridge",
    acres: 18,
    rateLakh: 220,
    type: "residential",
  },
  {
    slug: "tl-43-lonavala",
    name: "32 Acres · Lonavala Valley",
    acres: 32,
    rateLakh: 180,
    type: "agriculture",
  },
  {
    slug: "tl-44-khandala",
    name: "12 Acres · Khandala View",
    acres: 12,
    rateLakh: 350,
    type: "residential",
  },
  {
    slug: "tl-45-lonavala",
    name: "45 Acres · Lonavala Plateau",
    acres: 45,
    rateLakh: 150,
    type: "agriculture",
  },
];

const IMAGES = {
  agriculture: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
  ],
  residential: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  ],
};

function clampRate(lakh, min, max) {
  if (!Number.isFinite(lakh) || lakh <= 0) {
    return Math.round((min + max) / 2);
  }
  return Math.min(max, Math.max(min, Math.round(lakh)));
}

function applyCorridor(doc, corridorSlug, index) {
  const c = CORRIDORS[corridorSlug];
  const place = c.places[index % c.places.length];
  const acres =
    doc.area?.maxAcre ||
    (doc.area?.maxGuntha ? doc.area.maxGuntha / 40 : 10) ||
    10;
  const existingLakh = doc.pricing?.pricePerAcre
    ? doc.pricing.pricePerAcre / 100000
    : null;
  const rateLakh = clampRate(existingLakh, c.rateMinLakh, c.rateMaxLakh);
  const pricePerAcre = Math.round(rateLakh * 100000);
  const totalMin = Math.round(pricePerAcre * Math.max(acres * 0.85, 1));
  const totalMax = Math.round(pricePerAcre * acres);
  const guntha = Math.max(1, Math.round(acres * 40));

  return {
    location: {
      ...(doc.location || {}),
      state: "Maharashtra",
      district: c.district,
      taluka: place.taluka,
      village: place.village,
      lat: place.lat + (index % 5) * 0.008,
      lng: place.lng + (index % 4) * 0.007,
    },
    pricing: {
      ...(doc.pricing || {}),
      currency: "INR",
      minPrice: totalMin,
      maxPrice: totalMax,
      pricePerAcre,
      pricePerGuntha: Math.round(pricePerAcre / 40),
      bookingAmount: Math.min(
        500000,
        Math.round(totalMin * 0.02) || 100000
      ),
    },
    area: {
      ...(doc.area || {}),
      minGuntha: Math.max(1, Math.round(guntha * 0.5)),
      maxGuntha: guntha,
      minAcre: Math.round(acres * 0.5 * 10) / 10,
      maxAcre: acres,
    },
    pricePerSqFt: Math.round(pricePerAcre / 43560),
    tagline: `${c.name} · approx ₹${rateLakh}L / acre`,
    connectivity: [
      `${place.village}, ${c.district}`,
      `${c.name} corridor`,
      "Maharashtra land desk",
    ],
    highlights: [
      ...(Array.isArray(doc.highlights)
        ? doc.highlights.filter(
            (h) =>
              typeof h === "string" &&
              !/desk rate|corridor/i.test(h) &&
              !/daund|panvel|nashik|chandrapur|chandkhed|bhor|navi mumbai|alibag|igatpuri|mulshi|satara/i.test(
                h
              )
          )
        : []),
      `Approx ₹${c.rateMinLakh}L – ₹${c.rateMaxLakh}L / acre corridor`,
      `${c.name}`,
    ].slice(0, 4),
  };
}

function buildNewLonavala(spec, index) {
  const corridorSlug = "lonavala-khandala";
  const c = CORRIDORS[corridorSlug];
  const place = c.places[index % c.places.length];
  const rateLakh = clampRate(spec.rateLakh, c.rateMinLakh, c.rateMaxLakh);
  const pricePerAcre = Math.round(rateLakh * 100000);
  const acres = spec.acres;
  const totalMin = Math.round(pricePerAcre * Math.max(acres * 0.85, 1));
  const totalMax = Math.round(pricePerAcre * acres);
  const guntha = Math.max(1, Math.round(acres * 40));
  const imgs =
    spec.type === "residential" ? IMAGES.residential : IMAGES.agriculture;
  const cover = imgs[index % imgs.length];

  return {
    slug: spec.slug,
    name: spec.name,
    tagline: `${c.name} · approx ₹${rateLakh}L / acre`,
    category: spec.type === "residential" ? "na-villa-plot" : "agriculture-land",
    status: ["featured"],
    developmentStage: index % 2 === 0 ? "developed" : "under-development",
    location: {
      state: "Maharashtra",
      district: c.district,
      taluka: place.taluka,
      village: place.village,
      lat: place.lat + (index % 5) * 0.008,
      lng: place.lng + (index % 4) * 0.007,
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
    attributes:
      spec.type === "residential"
        ? ["road-touch", "hill-view", "clear-title"]
        : ["road-touch", "forest", "clear-title"],
    purposes:
      spec.type === "residential"
        ? ["villa", "appreciation"]
        : ["plantation", "farmhouse", "appreciation"],
    coverImage: cover,
    gallery: imgs,
    overview: `${spec.name} on the ${c.name} corridor. Desk rate band ₹${c.rateMinLakh}L – ₹${c.rateMaxLakh}L per acre.`,
    story:
      "Listed for the Lonavala — Khandala live corridor board. Rates are indicative desk guidance.",
    amenities: [
      { name: "Site visit on request" },
      { name: "Title diligence support" },
      { name: "Corridor market briefing" },
    ],
    highlights: [
      `Approx ₹${rateLakh}L / acre`,
      c.name,
      spec.type === "residential" ? "NA / villa potential" : "Agriculture land",
    ],
    connectivity: [
      `${place.village}, ${c.district}`,
      `${c.name} corridor`,
      "Maharashtra land desk",
    ],
    documents: [
      { title: "7/12 Extract", type: "7/12", url: "#" },
      { title: "Title Report", type: "title-report", url: "#" },
    ],
    plots: [
      {
        id: `${spec.slug}-p1`,
        number: "P-01",
        areaGuntha: Math.max(10, Math.round(guntha * 0.35)),
        price: Math.round(totalMin * 0.4),
        status: "available",
        facing: "East",
      },
      {
        id: `${spec.slug}-p2`,
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
    listingBadge: "available",
    pricePerSqFt: Math.round(pricePerAcre / 43560),
    growthPotentialPct: 11 + index,
    investmentHorizon: "5-8 years",
    growth3yPct: 28,
    growth5yPct: 48,
    demandLevel: "high",
    earlyAccess: false,
    waitlistEnabled: false,
    viewCount: 40 + index * 7,
    interestCount: 4 + index,
    ratingAvg: 4.3,
    ratingCount: 5,
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

  const assigned = new Set(Object.values(ASSIGNMENT).flat());
  const all = await Project.find({}).lean();
  console.log(`Loaded ${all.length} projects`);

  const missing = [...assigned].filter((slug) => !all.some((p) => p.slug === slug));
  if (missing.length) {
    console.warn("Missing slugs:", missing.join(", "));
  }
  const unassigned = all.filter((p) => !assigned.has(p.slug));
  if (unassigned.length) {
    console.warn(
      "Unassigned (will leave as-is):",
      unassigned.map((p) => p.slug).join(", ")
    );
  }

  let updated = 0;
  for (const [corridorSlug, slugs] of Object.entries(ASSIGNMENT)) {
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      const doc = all.find((p) => p.slug === slug);
      if (!doc) continue;
      const patch = applyCorridor(doc, corridorSlug, i);
      await Project.updateOne({ slug }, { $set: patch });
      updated += 1;
      console.log(`  ${slug} → ${corridorSlug} (${patch.location.village})`);
    }
  }

  // Fill Lonavala to 10
  let created = 0;
  for (let i = 0; i < NEW_LONAVALA.length; i++) {
    const doc = buildNewLonavala(NEW_LONAVALA[i], ASSIGNMENT["lonavala-khandala"].length + i);
    await Project.findOneAndUpdate(
      { slug: doc.slug },
      { $set: doc },
      { upsert: true, new: true }
    );
    created += 1;
    console.log(`  + ${doc.slug} → lonavala-khandala (${doc.location.village})`);
  }

  // Verify counts via alias match
  const after = await Project.find({}).lean();
  for (const [slug, c] of Object.entries(CORRIDORS)) {
    const aliases = c.places.flatMap((p) => [
      p.village.toLowerCase(),
      ...slug.split("-"),
    ]);
    const uniq = [...new Set(aliases)];
    const n = after.filter((p) => {
      const hay =
        `${p.location?.village} ${p.location?.taluka} ${p.location?.district} ${p.name}`.toLowerCase();
      return uniq.some((a) => hay.includes(a));
    }).length;
    console.log(`Match count ${slug}: ${n}`);
  }

  console.log(`Updated ${updated}, created ${created}. Total projects: ${after.length}`);
  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
