export type UserRole = "customer" | "sales" | "admin" | "superadmin";

export type ProjectCategory =
  | "agriculture-land"
  | "na-villa-plot"
  | "farm-house";

export type ProjectStatus =
  | "featured"
  | "trending"
  | "new-launch"
  | "upcoming"
  | "sold-out";

export type DevelopmentStage = "developed" | "under-development";

export type LocationAttribute =
  | "road-touch"
  | "river-touch"
  | "lake-view"
  | "hill-view"
  | "forest";

export type InvestmentPurpose =
  | "plantation"
  | "farmhouse"
  | "villa"
  | "appreciation"
  | "rental";

export interface ProjectLocation {
  state: string;
  district: string;
  taluka: string;
  village: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface ProjectPricing {
  currency: "INR";
  minPrice: number;
  maxPrice: number;
  pricePerGuntha?: number;
  pricePerAcre?: number;
  bookingAmount?: number;
}

export interface ProjectArea {
  minGuntha: number;
  maxGuntha: number;
  minAcre?: number;
  maxAcre?: number;
}

export interface ProjectAmenity {
  name: string;
  icon?: string;
}

export interface ProjectDocument {
  title: string;
  type:
    | "7/12"
    | "title-report"
    | "mutation"
    | "survey-map"
    | "approval"
    | "brochure"
    | "price-sheet"
    | "layout"
    | "other";
  url: string;
}

export interface ProjectPlot {
  id: string;
  number: string;
  areaGuntha: number;
  price: number;
  status: "available" | "reserved" | "sold";
  facing?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProjectCategory;
  status: ProjectStatus[];
  location: ProjectLocation;
  pricing: ProjectPricing;
  area: ProjectArea;
  attributes: LocationAttribute[];
  purposes: InvestmentPurpose[];
  coverImage: string;
  gallery: string[];
  heroVideo?: string;
  droneVideo?: string;
  overview: string;
  story: string;
  amenities: ProjectAmenity[];
  highlights: string[];
  connectivity: string[];
  documents: ProjectDocument[];
  plots: ProjectPlot[];
  appreciation?: string;
  legalStatus: string;
  featured?: boolean;
  developmentStage: DevelopmentStage;
  viewCount: number;
  interestCount: number;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

export interface InvestmentConcept {
  id: string;
  brand: "AVENZA" | "ORLANE" | "FLORAVE";
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  benefits: string[];
  businessModel: string;
  investmentPlan: string;
  incomeTimeline: string;
  maintenance: string;
  expectedReturns: string;
  coverImage: string;
  gallery: string[];
  faqs: { question: string; answer: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  project: string;
  avatar?: string;
}

export interface Offer {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
  sortOrder: number;
  validUntil: string;
}
