import type {
  BlogPost,
  InvestmentConcept,
  MarketIndexItem,
  MarketLocationItem,
  Offer,
  Project,
  Review,
  WaitlistItem,
} from "@/lib/types";

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  publicId?: string;
  type: "image" | "video" | "document" | "drone" | "other";
  category: string;
  alt?: string;
  projectSlug?: string;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string;
};

type Doc = Record<string, unknown> & {
  _id?: { toString(): string };
  createdAt?: Date | string;
};

export function serializeProject(doc: Doc): Project {
  return {
    id: doc._id?.toString() ?? String(doc.id ?? ""),
    slug: String(doc.slug),
    name: String(doc.name),
    tagline: String(doc.tagline ?? ""),
    category: doc.category as Project["category"],
    status: (doc.status as Project["status"]) ?? [],
    location: doc.location as Project["location"],
    pricing: doc.pricing as Project["pricing"],
    area: doc.area as Project["area"],
    attributes: (doc.attributes as Project["attributes"]) ?? [],
    purposes: (doc.purposes as Project["purposes"]) ?? [],
    coverImage: String(doc.coverImage ?? ""),
    gallery: (doc.gallery as string[]) ?? [],
    heroVideo: doc.heroVideo ? String(doc.heroVideo) : undefined,
    droneVideo: doc.droneVideo ? String(doc.droneVideo) : undefined,
    overview: String(doc.overview ?? ""),
    story: String(doc.story ?? ""),
    amenities: (doc.amenities as Project["amenities"]) ?? [],
    highlights: (doc.highlights as string[]) ?? [],
    connectivity: (doc.connectivity as string[]) ?? [],
    documents: (doc.documents as Project["documents"]) ?? [],
    plots: (doc.plots as Project["plots"]) ?? [],
    appreciation: doc.appreciation ? String(doc.appreciation) : undefined,
    legalStatus: String(doc.legalStatus ?? ""),
    featured: Boolean(doc.featured),
    developmentStage:
      (doc.developmentStage as Project["developmentStage"]) ||
      "under-development",
    viewCount: Number(doc.viewCount ?? 0),
    interestCount: Number(doc.interestCount ?? 0),
    ratingAvg: Number(doc.ratingAvg ?? 0),
    ratingCount: Number(doc.ratingCount ?? 0),
    listingBadge:
      (doc.listingBadge as Project["listingBadge"]) || "available",
    pricePerSqFt:
      doc.pricePerSqFt != null ? Number(doc.pricePerSqFt) : undefined,
    growthPotentialPct:
      doc.growthPotentialPct != null
        ? Number(doc.growthPotentialPct)
        : undefined,
    investmentHorizon: doc.investmentHorizon
      ? String(doc.investmentHorizon)
      : undefined,
    growth3yPct:
      doc.growth3yPct != null ? Number(doc.growth3yPct) : undefined,
    growth5yPct:
      doc.growth5yPct != null ? Number(doc.growth5yPct) : undefined,
    demandLevel: doc.demandLevel
      ? (doc.demandLevel as Project["demandLevel"])
      : undefined,
    earlyAccess: Boolean(doc.earlyAccess),
    waitlistEnabled: Boolean(doc.waitlistEnabled),
    createdAt:
      typeof doc.createdAt === "string"
        ? doc.createdAt
        : doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : new Date().toISOString(),
  };
}

export function serializeConcept(doc: Doc): InvestmentConcept {
  return {
    id: doc._id?.toString() ?? "",
    brand: doc.brand as InvestmentConcept["brand"],
    slug: String(doc.slug),
    name: String(doc.name),
    tagline: String(doc.tagline ?? ""),
    overview: String(doc.overview ?? ""),
    benefits: (doc.benefits as string[]) ?? [],
    businessModel: String(doc.businessModel ?? ""),
    investmentPlan: String(doc.investmentPlan ?? ""),
    incomeTimeline: String(doc.incomeTimeline ?? ""),
    maintenance: String(doc.maintenance ?? ""),
    expectedReturns: String(doc.expectedReturns ?? ""),
    coverImage: String(doc.coverImage ?? ""),
    gallery: (doc.gallery as string[]) ?? [],
    faqs: (doc.faqs as InvestmentConcept["faqs"]) ?? [],
  };
}

export function serializeBlog(doc: Doc): BlogPost & { body?: string } {
  return {
    id: doc._id?.toString() ?? "",
    slug: String(doc.slug),
    title: String(doc.title),
    excerpt: String(doc.excerpt ?? ""),
    coverImage: String(doc.coverImage ?? ""),
    category: String(doc.category ?? ""),
    author: String(doc.author ?? ""),
    publishedAt: String(doc.publishedAt ?? ""),
    readTime: String(doc.readTime ?? ""),
    body: doc.body ? String(doc.body) : undefined,
  };
}

export function serializeReview(doc: Doc): Review {
  return {
    id: doc._id?.toString() ?? "",
    name: String(doc.name),
    location: String(doc.location ?? ""),
    rating: Number(doc.rating ?? 5),
    quote: String(doc.quote ?? ""),
    project: String(doc.project ?? ""),
    avatar: doc.avatar ? String(doc.avatar) : undefined,
  };
}

export function serializeOffer(doc: Doc): Offer {
  return {
    id: doc._id?.toString() ?? "",
    eyebrow: String(doc.eyebrow ?? "Offer"),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    image: String(doc.image ?? ""),
    badge: String(doc.badge ?? ""),
    highlights: Array.isArray(doc.highlights)
      ? (doc.highlights as string[]).map(String).filter(Boolean)
      : [],
    ctaLabel: String(doc.ctaLabel ?? "View offer"),
    ctaHref: String(doc.ctaHref ?? "/projects"),
    active: doc.active !== false,
    sortOrder: Number(doc.sortOrder ?? 0),
    validUntil: String(doc.validUntil ?? ""),
  };
}

export function serializeMedia(doc: Doc): MediaItem {
  return {
    id: doc._id?.toString() ?? "",
    title: String(doc.title ?? ""),
    url: String(doc.url ?? ""),
    publicId: doc.publicId ? String(doc.publicId) : undefined,
    type: (doc.type as MediaItem["type"]) ?? "image",
    category: String(doc.category ?? "gallery"),
    alt: doc.alt ? String(doc.alt) : undefined,
    projectSlug: doc.projectSlug ? String(doc.projectSlug) : undefined,
    featured: Boolean(doc.featured),
    sortOrder: Number(doc.sortOrder ?? 0),
    createdAt:
      typeof doc.createdAt === "string"
        ? doc.createdAt
        : doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : undefined,
  };
}

export function serializeMarketIndex(doc: Doc): MarketIndexItem {
  return {
    id: doc._id?.toString() ?? "",
    name: String(doc.name),
    slug: String(doc.slug),
    pricePerSqFt: Number(doc.pricePerSqFt ?? 0),
    changePct: Number(doc.changePct ?? 0),
    sortOrder: Number(doc.sortOrder ?? 0),
    featured: Boolean(doc.featured),
    active: doc.active !== false,
  };
}

export function serializeMarketLocation(doc: Doc): MarketLocationItem {
  const series = Array.isArray(doc.series)
    ? (doc.series as { year?: number; pricePerSqFt?: number }[]).map((p) => ({
        year: Number(p.year ?? 0),
        pricePerSqFt: Number(p.pricePerSqFt ?? 0),
      }))
    : [];
  return {
    id: doc._id?.toString() ?? "",
    name: String(doc.name),
    slug: String(doc.slug),
    lat: Number(doc.lat ?? 0),
    lng: Number(doc.lng ?? 0),
    changePct: Number(doc.changePct ?? 0),
    series,
    sortOrder: Number(doc.sortOrder ?? 0),
    active: doc.active !== false,
  };
}

export function serializeWaitlist(doc: Doc): WaitlistItem {
  return {
    id: doc._id?.toString() ?? "",
    projectSlug: String(doc.projectSlug),
    name: String(doc.name),
    email: String(doc.email),
    phone: doc.phone ? String(doc.phone) : undefined,
    createdAt:
      typeof doc.createdAt === "string"
        ? doc.createdAt
        : doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : new Date().toISOString(),
  };
}
