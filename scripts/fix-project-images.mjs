/**
 * Re-assign verified cover + gallery images for every project.
 * Usage: node scripts/fix-project-images.mjs
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
} catch {}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const LAND_IMAGES = {
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
};

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function bucketFor(category, name = "", overview = "") {
  const t = `${category} ${name} ${overview}`.toLowerCase();
  if (t.includes("industrial") || t.includes("warehouse") || t.includes("logistics")) {
    return "industrial";
  }
  if (
    t.includes("villa") ||
    t.includes("residential") ||
    t.includes("na-villa") ||
    t.includes("farm-house") ||
    t.includes("r zone") ||
    t.includes("r-zone")
  ) {
    return "residential";
  }
  if (t.includes("lake") || t.includes("hill") || t.includes("lonavala")) {
    return "scenic";
  }
  return "agriculture";
}

function pickCover(seed, bucket) {
  const list = LAND_IMAGES[bucket] || LAND_IMAGES.agriculture;
  return list[hash(seed) % list.length];
}

function pickGallery(seed, bucket) {
  const primary = LAND_IMAGES[bucket] || LAND_IMAGES.agriculture;
  const pool = [...primary, ...LAND_IMAGES.scenic, ...LAND_IMAGES.agriculture];
  const start = hash(`${seed}-g`) % pool.length;
  const out = [];
  for (let i = 0; i < 4; i++) {
    const url = pool[(start + i * 3) % pool.length];
    if (!out.includes(url)) out.push(url);
  }
  return out;
}

async function main() {
  await mongoose.connect(uri);
  const Project =
    mongoose.models.Project ||
    mongoose.model(
      "Project",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

  const docs = await Project.find({}).lean();
  let updated = 0;

  for (const doc of docs) {
    const bucket = bucketFor(doc.category, doc.name, doc.overview);
    const seed = String(doc.slug || doc._id);
    const coverImage = pickCover(seed, bucket);
    const gallery = pickGallery(seed, bucket);
    await Project.updateOne(
      { _id: doc._id },
      { $set: { coverImage, gallery } }
    );
    updated += 1;
  }

  console.log(`Updated images on ${updated} projects`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
