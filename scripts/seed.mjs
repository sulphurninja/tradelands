import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local without extra deps
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

const img = {
  farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
  crop: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80",
  field: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80",
  villa: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
  villa2: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
  house: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80",
  house2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
  green: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80",
  hills: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  lake: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1600&q=80",
  docs: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
  keys: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
};

const projects = [
  {
    slug: "emerald-acres-mulshi",
    name: "Emerald Acres",
    tagline: "River-side agri land in Mulshi, Pune",
    category: "agriculture-land",
    status: ["featured", "trending"],
    location: {
      state: "Maharashtra",
      district: "Pune",
      taluka: "Mulshi",
      village: "Tamhini",
      lat: 18.4489,
      lng: 73.4082,
    },
    pricing: {
      currency: "INR",
      minPrice: 2500000,
      maxPrice: 8500000,
      pricePerGuntha: 250000,
      bookingAmount: 100000,
    },
    area: { minGuntha: 10, maxGuntha: 40, minAcre: 0.25, maxAcre: 1 },
    attributes: ["road-touch", "river-touch", "forest", "hill-view"],
    purposes: ["plantation", "farmhouse", "appreciation"],
    coverImage: img.farm,
    gallery: [img.farm, img.crop, img.green, img.hills, img.lake],
    heroVideo:
      "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-lush-green-landscape-5725/1080p.mp4",
    droneVideo:
      "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-lush-green-landscape-5725/1080p.mp4",
    overview:
      "Clear-title agriculture plots near Mulshi river. Ready for plantation or a future farm house.",
    story:
      "Each plot is surveyed and documented. You can check layouts, pricing, and papers online before you visit.",
    amenities: [
      { name: "Internal Roads" },
      { name: "Borewell Access" },
      { name: "Fencing" },
      { name: "Plantation Support" },
      { name: "Security Gate" },
      { name: "Site Office" },
    ],
    highlights: [
      "7/12 and title papers available",
      "Near river belt",
      "Plantation packages on request",
      "Farm house construction support",
    ],
    connectivity: [
      "About 45 mins from Pune",
      "Near Tamhini Ghat",
      "12 km from Mulshi Dam",
    ],
    documents: [
      { title: "7/12 Extract", type: "7/12", url: "#" },
      { title: "Title Report", type: "title-report", url: "#" },
      { title: "Survey Map", type: "survey-map", url: "#" },
      { title: "Project Brochure", type: "brochure", url: "#" },
    ],
    plots: [
      { id: "p1", number: "A-12", areaGuntha: 12, price: 3000000, status: "available", facing: "East" },
      { id: "p2", number: "A-18", areaGuntha: 20, price: 5000000, status: "available", facing: "North" },
      { id: "p3", number: "B-04", areaGuntha: 15, price: 3750000, status: "reserved", facing: "West" },
      { id: "p4", number: "B-11", areaGuntha: 40, price: 8500000, status: "available", facing: "South" },
    ],
    appreciation: "Around 12–18% over 5 years (estimate)",
    legalStatus: "Clear title · Mutation done",
    featured: true,
    developmentStage: "developed",
    viewCount: 128,
    interestCount: 24,
    ratingAvg: 4.6,
    ratingCount: 18,
  },
  {
    slug: "orlane-villas-lonavala",
    name: "Orlane Villas",
    tagline: "NA villa plots in Lonavala",
    category: "na-villa-plot",
    status: ["featured", "new-launch"],
    location: {
      state: "Maharashtra",
      district: "Pune",
      taluka: "Maval",
      village: "Kusgaon",
      lat: 18.7557,
      lng: 73.4082,
    },
    pricing: {
      currency: "INR",
      minPrice: 4500000,
      maxPrice: 18000000,
      pricePerGuntha: 450000,
      bookingAmount: 250000,
    },
    area: { minGuntha: 10, maxGuntha: 40 },
    attributes: ["road-touch", "hill-view", "lake-view"],
    purposes: ["villa", "appreciation", "rental"],
    coverImage: img.villa,
    gallery: [img.villa, img.villa2, img.house, img.hills],
    overview:
      "NA plots with club house, roads, and villa construction packages. Built for a second home near Lonavala.",
    story:
      "Buy a plot with clear NA papers. Add a villa package when you are ready — timelines and costs stay clear.",
    amenities: [
      { name: "Club House" },
      { name: "Swimming Pool" },
      { name: "Underground Electrification" },
      { name: "Rainwater Harvesting" },
      { name: "Landscaped Avenue" },
      { name: "24×7 Security" },
    ],
    highlights: [
      "Fully NA converted",
      "3 villa design options",
      "Construction support",
      "Interior and pool add-ons",
    ],
    connectivity: [
      "10 mins from Lonavala station",
      "Mumbai–Pune Expressway access",
      "Near Tiger Point",
    ],
    documents: [
      { title: "NA Order", type: "approval", url: "#" },
      { title: "Layout Sanction", type: "layout", url: "#" },
      { title: "Title Report", type: "title-report", url: "#" },
      { title: "Price Sheet", type: "price-sheet", url: "#" },
    ],
    plots: [
      { id: "v1", number: "OV-07", areaGuntha: 10, price: 4500000, status: "available" },
      { id: "v2", number: "OV-14", areaGuntha: 15, price: 6750000, status: "available" },
      { id: "v3", number: "OV-22", areaGuntha: 20, price: 9000000, status: "sold" },
    ],
    appreciation: "Around 15–22% over 5 years (estimate)",
    legalStatus: "NA · Layout sanctioned",
    featured: true,
  },
  {
    slug: "avenza-grove-nashik",
    name: "Avenza Grove",
    tagline: "Plantation land near Nashik",
    category: "agriculture-land",
    status: ["trending", "featured"],
    location: {
      state: "Maharashtra",
      district: "Nashik",
      taluka: "Dindori",
      village: "Vani",
      lat: 20.2069,
      lng: 73.75,
    },
    pricing: {
      currency: "INR",
      minPrice: 1800000,
      maxPrice: 6000000,
      pricePerGuntha: 180000,
      bookingAmount: 75000,
    },
    area: { minGuntha: 10, maxGuntha: 40 },
    attributes: ["road-touch", "forest"],
    purposes: ["plantation", "appreciation"],
    coverImage: img.field,
    gallery: [img.field, img.crop, img.green],
    overview:
      "Agriculture land with a managed plantation plan — grapes, mango, or timber, with clear cost and yield reporting.",
    story:
      "You own the land. Our team handles planting and upkeep. You get simple quarterly updates.",
    amenities: [
      { name: "Drip Irrigation" },
      { name: "Cold Storage Access" },
      { name: "Farm Manager" },
      { name: "Yield Reports" },
    ],
    highlights: [
      "Managed plantation model",
      "Quarterly reports",
      "Buyback on select packages",
    ],
    connectivity: [
      "About 55 mins from Nashik city",
      "Near wine tourism belt",
    ],
    documents: [
      { title: "7/12 Extract", type: "7/12", url: "#" },
      { title: "Mutation", type: "mutation", url: "#" },
    ],
    plots: [
      { id: "a1", number: "AG-03", areaGuntha: 10, price: 1800000, status: "available" },
      { id: "a2", number: "AG-09", areaGuntha: 20, price: 3600000, status: "available" },
    ],
    appreciation: "Land growth + plantation income",
    legalStatus: "Clear agricultural title",
    featured: true,
  },
  {
    slug: "florave-estate-alibaug",
    name: "Florave Estate",
    tagline: "Farm houses near Alibaug",
    category: "farm-house",
    status: ["new-launch", "featured"],
    location: {
      state: "Maharashtra",
      district: "Raigad",
      taluka: "Alibag",
      village: "Mandwa",
      lat: 18.8067,
      lng: 72.881,
    },
    pricing: {
      currency: "INR",
      minPrice: 12000000,
      maxPrice: 45000000,
      bookingAmount: 500000,
    },
    area: { minGuntha: 20, maxGuntha: 80 },
    attributes: ["road-touch", "hill-view", "forest"],
    purposes: ["farmhouse", "rental", "appreciation"],
    coverImage: img.house,
    gallery: [img.house, img.house2, img.villa2],
    overview:
      "Ready farm house options near Mandwa — from modern villas to glass and prefab homes.",
    story:
      "Pick a home style, see the cost and timeline, and move at your pace. Optional rental help after handover.",
    amenities: [
      { name: "Private Pool Options" },
      { name: "Caretaker Quarters" },
      { name: "Solar Ready" },
      { name: "Landscape Design" },
    ],
    highlights: [
      "5 home styles",
      "Shell to turnkey packages",
      "Optional rental management",
    ],
    connectivity: [
      "25 mins from Mandwa jetty",
      "Ferry from Gateway of India",
    ],
    documents: [
      { title: "Title Report", type: "title-report", url: "#" },
      { title: "Brochure", type: "brochure", url: "#" },
    ],
    plots: [
      { id: "f1", number: "FE-01", areaGuntha: 20, price: 12000000, status: "available" },
      { id: "f2", number: "FE-05", areaGuntha: 40, price: 24000000, status: "reserved" },
    ],
    appreciation: "Lifestyle use + weekend rental potential",
    legalStatus: "Clear title · Construction allowed",
    featured: true,
  },
  {
    slug: "konkan-coast-drop",
    name: "Konkan",
    tagline: "500+ acres · early access coastal corridor",
    category: "agriculture-land",
    status: ["upcoming"],
    location: {
      state: "Maharashtra",
      district: "Raigad",
      taluka: "Mangaon",
      village: "Konkan Belt",
      lat: 18.2355,
      lng: 73.2625,
    },
    pricing: {
      currency: "INR",
      minPrice: 3200000,
      maxPrice: 9500000,
      pricePerGuntha: 320000,
      bookingAmount: 150000,
    },
    area: { minGuntha: 10, maxGuntha: 30 },
    attributes: ["hill-view", "road-touch", "forest"],
    purposes: ["farmhouse", "plantation", "appreciation"],
    coverImage: img.hills,
    gallery: [img.hills, img.farm, img.green],
    overview:
      "Upcoming hill plots with cool weather and tourism nearby. Pre-launch pricing for early buyers.",
    story:
      "Limited plots. Good for a quiet weekend farm stay once permissions are in place.",
    amenities: [
      { name: "Viewpoints" },
      { name: "Approach Road Upgrade" },
      { name: "Water Survey Done" },
    ],
    highlights: [
      "Pre-launch price",
      "Limited 48 plots",
      "Suitable for farm stay plans",
    ],
    connectivity: [
      "20 mins from Panchgani",
      "Hill station belt",
    ],
    documents: [{ title: "Survey Map", type: "survey-map", url: "#" }],
    plots: [
      { id: "s1", number: "SR-02", areaGuntha: 12, price: 3840000, status: "available" },
    ],
    appreciation: "Early-buyer upside expected",
    legalStatus: "Title check in progress",
    featured: false,
  },
  {
    slug: "lakeview-na-igatpuri",
    name: "Lakeview NA",
    tagline: "Lakeside NA plots in Igatpuri",
    category: "na-villa-plot",
    status: ["trending"],
    location: {
      state: "Maharashtra",
      district: "Nashik",
      taluka: "Igatpuri",
      village: "Ghoti",
      lat: 19.695,
      lng: 73.5626,
    },
    pricing: {
      currency: "INR",
      minPrice: 3800000,
      maxPrice: 12000000,
      pricePerGuntha: 380000,
      bookingAmount: 200000,
    },
    area: { minGuntha: 10, maxGuntha: 30 },
    attributes: ["lake-view", "road-touch", "hill-view"],
    purposes: ["villa", "appreciation"],
    coverImage: img.lake,
    gallery: [img.lake, img.villa, img.hills],
    overview:
      "NA plots facing water bodies. Short drive from Mumbai on NH160. Ready for villa construction.",
    story:
      "Quiet weekend location with clear NA status and gated entry.",
    amenities: [
      { name: "Gated Entry" },
      { name: "Street Lighting" },
      { name: "Water Connection Plan" },
    ],
    highlights: [
      "Lake-facing plots",
      "NA conversion complete",
      "Villa partners available",
    ],
    connectivity: [
      "About 2.5 hrs from Mumbai",
      "Near Igatpuri station",
    ],
    documents: [
      { title: "NA Order", type: "approval", url: "#" },
      { title: "Layout", type: "layout", url: "#" },
    ],
    plots: [
      { id: "l1", number: "LV-08", areaGuntha: 12, price: 4560000, status: "available" },
      { id: "l2", number: "LV-15", areaGuntha: 18, price: 6840000, status: "available" },
    ],
    appreciation: "Around 14–20% over 5 years (estimate)",
    legalStatus: "NA · Clear title",
    featured: false,
  },
];

const concepts = [
  {
    brand: "AVENZA",
    slug: "avenza",
    name: "AVENZA",
    tagline: "Plantation land with managed farming",
    overview:
      "Buy land. We plant and maintain it. You get clear reports on cost and yield.",
    benefits: [
      "You keep land ownership",
      "Crop options: mango, grape, sandalwood, teak",
      "Simple quarterly reports",
      "Buyback on select packages",
    ],
    businessModel:
      "You own the plot. AVENZA runs farming under a clear service plan.",
    investmentPlan: "Starts from about ₹18L for 10 guntha managed plots.",
    incomeTimeline:
      "Years 1–2 setup. Year 3 early yield. Year 5+ steadier returns by crop.",
    maintenance: "Included for first 36 months on signature packages.",
    expectedReturns: "Land value growth plus crop income on select tracks.",
    coverImage: img.green,
    gallery: [img.crop, img.field],
    faqs: [
      {
        question: "Do I need farming experience?",
        answer: "No. Our team handles day-to-day work. You own the land and get updates.",
      },
      {
        question: "Can I build a farm house later?",
        answer: "On eligible plots, yes — as per local rules and plot size.",
      },
    ],
  },
  {
    brand: "ORLANE",
    slug: "orlane",
    name: "ORLANE",
    tagline: "NA villa plots with clear build plans",
    overview:
      "NA plots with roads, club facilities, and villa packages you can start when ready.",
    benefits: [
      "Fully NA inventory",
      "Club house and landscaping",
      "Villa, interior, and pool packages",
      "Clear construction timelines",
    ],
    businessModel:
      "Buy the plot. Add a construction package later through our vetted partners.",
    investmentPlan: "Plots from about ₹45L. Construction billed by milestone.",
    incomeTimeline:
      "Main value from use and appreciation. Rental help available after handover.",
    maintenance: "Society / HOA model after possession.",
    expectedReturns: "Strong use value with growth in active corridors.",
    coverImage: img.villa,
    gallery: [img.villa2, img.house2],
    faqs: [
      {
        question: "Is construction mandatory?",
        answer: "No. Hold the NA plot, or build when you are ready.",
      },
    ],
  },
  {
    brand: "FLORAVE",
    slug: "florave",
    name: "FLORAVE",
    tagline: "Farm houses for weekend living",
    overview:
      "Turnkey farm houses — modern, traditional, prefab, glass, or custom — with clear pricing.",
    benefits: [
      "Five home styles",
      "Interior and exterior packages",
      "Optional rental management",
      "Solar and water-wise defaults",
    ],
    businessModel:
      "Land plus home package, or design-build on your Florave plot.",
    investmentPlan: "Estates from about ₹1.2 Cr including land and base structure.",
    incomeTimeline:
      "Use it as a retreat. Weekend rentals possible after handover.",
    maintenance: "Caretaker and garden plans available.",
    expectedReturns: "Lifestyle use first, with rental upside in tourist belts.",
    coverImage: img.house,
    gallery: [img.house2],
    faqs: [
      {
        question: "Can I customise the floor plan?",
        answer: "Yes. Start with a style, then adjust with our design team.",
      },
    ],
  },
];

const blogs = [
  {
    slug: "how-to-read-a-7-12-extract",
    title: "How to read a 7/12 before you buy land",
    excerpt:
      "A simple guide to Maharashtra’s key agri land paper — and what to check first.",
    body: "A 7/12 extract shows ownership, crop type, and other land details. Always match the survey number, owner name, and any loans or disputes before you pay a booking amount. Ask for the latest mutation entry as well.",
    coverImage: img.docs,
    category: "Legal Guide",
    author: "TradeLands Legal Desk",
    publishedAt: "2026-03-12",
    readTime: "6 min",
  },
  {
    slug: "na-vs-agriculture-land",
    title: "NA plot vs agriculture land: which fits you?",
    excerpt:
      "A clear comparison of use, permissions, cost, and growth for first-time buyers.",
    body: "Agriculture land suits plantation and long hold. NA plots suit villa building and faster lifestyle use. Check conversion papers, water, road access, and your budget before you choose.",
    coverImage: img.keys,
    category: "Investment Guide",
    author: "Research Team",
    publishedAt: "2026-02-28",
    readTime: "5 min",
  },
  {
    slug: "plantation-income-timelines",
    title: "Plantation income: what to expect year by year",
    excerpt:
      "Realistic timelines for mango, grape, and timber tracks under managed farming.",
    body: "Most plantations need setup years before steady income. Grapes can yield earlier. Mango and timber take longer. Always read the cost sheet and yield plan before you invest.",
    coverImage: img.green,
    category: "Plantation",
    author: "AVENZA Desk",
    publishedAt: "2026-01-20",
    readTime: "7 min",
  },
];

const reviews = [
  {
    name: "Ananya Mehta",
    location: "Mumbai",
    rating: 5,
    quote:
      "All papers were online before my visit. I booked a Mulshi plot with full clarity.",
    project: "Emerald Acres",
  },
  {
    name: "Rohan Deshpande",
    location: "Pune",
    rating: 5,
    quote:
      "NA papers and villa packages were clear. No confusion on cost or timeline.",
    project: "Orlane Villas",
  },
  {
    name: "Priya & Kabir Shah",
    location: "Bengaluru",
    rating: 5,
    quote:
      "Plantation reports are simple and regular. Easy to track what we own.",
    project: "Avenza Grove",
  },
];

const offers = [
  {
    eyebrow: "Limited offer",
    title: "Mulshi early-bird plantation package",
    description:
      "Book selected Emerald Acres plots this month and get a free site visit with plantation advisory included.",
    image: img.farm,
    badge: "Early bird",
    highlights: [
      "Free private site visit",
      "Plantation advisory included",
      "Flexible booking amount",
    ],
    ctaLabel: "View Emerald Acres",
    ctaHref: "/projects/emerald-acres-mulshi",
    active: true,
    sortOrder: 0,
    validUntil: "31 Aug 2026",
  },
  {
    eyebrow: "New launch",
    title: "Lonavala NA villa plots — launch benefits",
    description:
      "Priority inventory and launch pricing on Orlane Villas. Clear NA papers and ready villa packages.",
    image: img.villa,
    badge: "New launch",
    highlights: [
      "Priority plot choice",
      "Clear NA documentation",
      "Villa package options",
    ],
    ctaLabel: "Explore Orlane",
    ctaHref: "/projects/orlane-villas-lonavala",
    active: true,
    sortOrder: 1,
    validUntil: "15 Sep 2026",
  },
];

const mediaItems = [
  {
    title: "Drone over Mulshi",
    url: "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-lush-green-landscape-5725/1080p.mp4",
    type: "drone",
    category: "gallery",
    featured: true,
    sortOrder: 0,
  },
  {
    title: "Aerial estates",
    url: img.farm,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "Plantation rows",
    url: img.crop,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "Villa living",
    url: img.villa,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 3,
  },
  {
    title: "Farm houses",
    url: img.house,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 4,
  },
  {
    title: "Hill views",
    url: img.hills,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 5,
  },
  {
    title: "Lake corridors",
    url: img.lake,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 6,
  },
  {
    title: "Construction updates",
    url: img.green,
    type: "image",
    category: "construction",
    featured: true,
    sortOrder: 7,
  },
  {
    title: "Customer stories",
    url: img.house2,
    type: "image",
    category: "gallery",
    featured: true,
    sortOrder: 8,
  },
];

const ProjectSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ConceptSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const BlogSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ReviewSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const OfferSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const MediaSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Concept = mongoose.models.Concept || mongoose.model("Concept", ConceptSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true },
        phone: String,
        passwordHash: String,
        role: {
          type: String,
          enum: ["customer", "sales", "admin", "superadmin"],
          default: "customer",
        },
        active: { type: Boolean, default: true },
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        referralCode: String,
        wishlist: [String],
      },
      { timestamps: true }
    )
  );

const PlatformSettings =
  mongoose.models.PlatformSettings ||
  mongoose.model(
    "PlatformSettings",
    new mongoose.Schema(
      {
        key: { type: String, unique: true, default: "default" },
        siteName: String,
        domain: String,
        tagline: String,
        phone: String,
        email: String,
        whatsapp: String,
        address: String,
        supportEmail: String,
        bookingDepositInr: Number,
        maintenanceMode: Boolean,
        allowRegistrations: Boolean,
        enableCompare: Boolean,
        enableWishlist: Boolean,
        enableSiteVisits: Boolean,
        seoTitle: String,
        seoDescription: String,
      },
      { timestamps: true }
    )
  );

const marketIndices = [
  {
    name: "Maharashtra Land Index",
    slug: "maharashtra-land-index",
    pricePerSqFt: 286,
    changePct: 12.84,
    sortOrder: 0,
    featured: true,
    active: true,
  },
  {
    name: "Karjat",
    slug: "karjat",
    pricePerSqFt: 320,
    changePct: 18.2,
    sortOrder: 1,
    featured: true,
    active: true,
  },
  {
    name: "Roha",
    slug: "roha",
    pricePerSqFt: 200,
    changePct: 14.6,
    sortOrder: 2,
    featured: true,
    active: true,
  },
  {
    name: "Alibaug",
    slug: "alibaug",
    pricePerSqFt: 410,
    changePct: 11.8,
    sortOrder: 3,
    featured: true,
    active: true,
  },
  {
    name: "Khalapur",
    slug: "khalapur",
    pricePerSqFt: 245,
    changePct: 9.4,
    sortOrder: 4,
    featured: true,
    active: true,
  },
  {
    name: "Panvel",
    slug: "panvel",
    pricePerSqFt: 380,
    changePct: 7.9,
    sortOrder: 5,
    featured: true,
    active: true,
  },
];

const marketLocations = [
  {
    name: "Mumbai",
    slug: "mumbai",
    lat: 19.076,
    lng: 72.8777,
    changePct: 6.2,
    sortOrder: 0,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 420 },
      { year: 2024, pricePerSqFt: 455 },
      { year: 2025, pricePerSqFt: 490 },
      { year: 2026, pricePerSqFt: 530 },
    ],
  },
  {
    name: "Panvel",
    slug: "panvel",
    lat: 18.9894,
    lng: 73.1175,
    changePct: 7.9,
    sortOrder: 1,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 300 },
      { year: 2024, pricePerSqFt: 330 },
      { year: 2025, pricePerSqFt: 355 },
      { year: 2026, pricePerSqFt: 380 },
    ],
  },
  {
    name: "Karjat",
    slug: "karjat",
    lat: 18.9102,
    lng: 73.3235,
    changePct: 18.2,
    sortOrder: 2,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 200 },
      { year: 2024, pricePerSqFt: 250 },
      { year: 2025, pricePerSqFt: 300 },
      { year: 2026, pricePerSqFt: 350 },
    ],
  },
  {
    name: "Khopoli",
    slug: "khopoli",
    lat: 18.7857,
    lng: 73.3452,
    changePct: 10.1,
    sortOrder: 3,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 180 },
      { year: 2024, pricePerSqFt: 210 },
      { year: 2025, pricePerSqFt: 240 },
      { year: 2026, pricePerSqFt: 270 },
    ],
  },
  {
    name: "Roha",
    slug: "roha",
    lat: 18.4411,
    lng: 73.1195,
    changePct: 14.6,
    sortOrder: 4,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 140 },
      { year: 2024, pricePerSqFt: 165 },
      { year: 2025, pricePerSqFt: 185 },
      { year: 2026, pricePerSqFt: 200 },
    ],
  },
  {
    name: "Mangaon",
    slug: "mangaon",
    lat: 18.2355,
    lng: 73.2625,
    changePct: 8.5,
    sortOrder: 5,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 120 },
      { year: 2024, pricePerSqFt: 140 },
      { year: 2025, pricePerSqFt: 155 },
      { year: 2026, pricePerSqFt: 170 },
    ],
  },
  {
    name: "Alibaug",
    slug: "alibaug",
    lat: 18.6411,
    lng: 72.8722,
    changePct: 11.8,
    sortOrder: 6,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 320 },
      { year: 2024, pricePerSqFt: 355 },
      { year: 2025, pricePerSqFt: 385 },
      { year: 2026, pricePerSqFt: 410 },
    ],
  },
  {
    name: "Khalapur",
    slug: "khalapur",
    lat: 18.8292,
    lng: 73.2747,
    changePct: 9.4,
    sortOrder: 7,
    active: true,
    series: [
      { year: 2023, pricePerSqFt: 180 },
      { year: 2024, pricePerSqFt: 205 },
      { year: 2025, pricePerSqFt: 225 },
      { year: 2026, pricePerSqFt: 245 },
    ],
  },
];

const seedUsers = [
  {
    name: "TradeLands Super Admin",
    email: "superadmin@tradelands.ind",
    phone: "+919876543210",
    role: "superadmin",
    password: "Super@12345",
  },
  {
    name: "TradeLands Admin",
    email: "admin@tradelands.ind",
    phone: "+919876543211",
    role: "admin",
    password: "Admin@12345",
  },
  {
    name: "Sales Desk",
    email: "sales@tradelands.ind",
    phone: "+919876543212",
    role: "sales",
    password: "Sales@12345",
    referralCode: "TL-AGENT01",
  },
  {
    name: "Demo Investor",
    email: "investor@tradelands.ind",
    phone: "+919876543213",
    role: "customer",
    password: "Investor@12345",
  },
];

async function seed() {
  console.log("Connecting to Atlas…");
  await mongoose.connect(uri);
  console.log("Connected.");

  await Promise.all([
    Project.deleteMany({}),
    Concept.deleteMany({}),
    Blog.deleteMany({}),
    Review.deleteMany({}),
    Offer.deleteMany({}),
    Media.deleteMany({}),
    mongoose.connection.collection("marketindices").deleteMany({}),
    mongoose.connection.collection("marketlocations").deleteMany({}),
    mongoose.connection.collection("waitlistentries").deleteMany({}),
    User.deleteMany({
      email: { $in: seedUsers.map((u) => u.email) },
    }),
    PlatformSettings.deleteMany({ key: "default" }),
  ]);

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

  await Project.insertMany(
    projects.map((p, i) => {
      const badges = ["available", "premium", "high-demand", "coming-soon"];
      const isUpcoming = Array.isArray(p.status) && p.status.includes("upcoming");
      return {
        developmentStage: i % 2 === 0 ? "developed" : "under-development",
        viewCount: 40 + i * 17,
        interestCount: 5 + i * 3,
        ratingAvg: 4 + (i % 10) / 10,
        ratingCount: 4 + i * 2,
        listingBadge: isUpcoming ? "coming-soon" : badges[i % 3],
        pricePerSqFt: 180 + i * 35,
        growthPotentialPct: 8 + (i % 7) * 1.2,
        investmentHorizon: i % 2 === 0 ? "3-5 years" : "5-8 years",
        growth3yPct: 28 + i * 3.2,
        growth5yPct: 48 + i * 4.1,
        demandLevel: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
        earlyAccess: isUpcoming,
        waitlistEnabled: isUpcoming,
        ...p,
        location: {
          ...p.location,
          lat: p.location?.lat ?? 18.5 + i * 0.08,
          lng: p.location?.lng ?? 73.2 + i * 0.05,
        },
      };
    })
  );
  await Concept.insertMany(concepts);
  await Blog.insertMany(blogs);
  await Review.insertMany(reviews);
  await Offer.insertMany(offers);
  await Media.insertMany(mediaItems);
  await MarketIndex.insertMany(marketIndices);
  await MarketLocation.insertMany(marketLocations);
  await PlatformSettings.create({
    key: "default",
    siteName: "TradeLands",
    domain: "TradeLands.IND",
    tagline:
      "Agriculture land, NA villa plots, and farm houses — clear papers, clear pricing.",
    phone: "+91 98765 43210",
    email: "invest@tradelands.ind",
    whatsapp: "919876543210",
    address: "Pune · Mumbai · Nashik · Hyderabad",
    supportEmail: "support@tradelands.ind",
    bookingDepositInr: 25000,
    maintenanceMode: false,
    allowRegistrations: true,
    enableCompare: true,
    enableWishlist: true,
    enableSiteVisits: true,
    seoTitle: "TradeLands.IND — Premium Agriculture Land & NA Villa Plots",
    seoDescription:
      "Agriculture land, NA villa plots, and farm houses in India — with clear pricing, legal papers, and online booking.",
  });

  const users = await Promise.all(
    seedUsers.map(async (u) => ({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      active: true,
      emailVerified: true,
      phoneVerified: false,
      referralCode: u.referralCode || undefined,
      passwordHash: await bcrypt.hash(u.password, 12),
      wishlist: [],
    }))
  );
  await User.insertMany(users);

  console.log(`Seeded ${projects.length} projects`);
  console.log(`Seeded ${marketIndices.length} market indices`);
  console.log(`Seeded ${marketLocations.length} market locations`);
  console.log(`Seeded ${concepts.length} concepts`);
  console.log(`Seeded ${blogs.length} blogs`);
  console.log(`Seeded ${reviews.length} reviews`);
  console.log(`Seeded ${offers.length} offers`);
  console.log(`Seeded ${mediaItems.length} media items`);
  console.log(`Seeded ${users.length} users`);
  console.log("Seeded platform settings");
  console.log("\nLogin accounts:");
  for (const u of seedUsers) {
    console.log(`  ${u.role.padEnd(11)} ${u.email} / ${u.password}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
