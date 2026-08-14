export const SITE = {
  name: "TradeLands",
  domain: "TradeLands.IND",
  tagline:
    "Premium land opportunities across Maharashtra — discover, compare, invest, track.",
  phone: "+91 98765 43210",
  email: "invest@tradelands.ind",
  whatsapp: "919876543210",
  address: "Pune · Mumbai · Nashik · Hyderabad",
};

/** Premium platform nav — flat links */
export const NAV_LINKS = [
  { href: "/market", label: "Market" },
  { href: "/discover", label: "Discover" },
  { href: "/market?featured=1", label: "Opportunities" },
  { href: "/map", label: "Map" },
  { href: "/dashboard", label: "Portfolio" },
  { href: "/blogs", label: "Insights" },
] as const;

export const LOCATION_ATTRIBUTES = [
  { value: "road-touch", label: "Road Touch" },
  { value: "river-touch", label: "River Touch" },
  { value: "lake-view", label: "Lake View" },
  { value: "hill-view", label: "Hill View" },
  { value: "forest", label: "Forest" },
  { value: "mountain-view", label: "Mountain View" },
  { value: "valley-view", label: "Valley View" },
  { value: "waterfall", label: "Waterfall" },
  { value: "corner-plot", label: "Corner Plot" },
  { value: "gated-project", label: "Gated Project" },
] as const;

export const CATEGORIES = [
  { value: "agriculture-land", label: "Agriculture Land" },
  { value: "na-villa-plot", label: "NA Villa Plot" },
  { value: "farm-house", label: "Farm House" },
] as const;

export const INVESTMENT_PURPOSES = [
  { value: "plantation", label: "Plantation" },
  { value: "farmhouse", label: "Farm House" },
  { value: "villa", label: "Villa" },
  { value: "appreciation", label: "Appreciation" },
  { value: "rental", label: "Rental Income" },
] as const;

export const INVESTMENT_HORIZONS = [
  { value: "1-3 years", label: "1–3 years" },
  { value: "3-5 years", label: "3–5 years" },
  { value: "5-8 years", label: "5–8 years" },
  { value: "8+ years", label: "8+ years" },
] as const;

export const LISTING_BADGE_META = {
  available: { label: "Available", color: "#22c55e" },
  "coming-soon": { label: "Coming Soon", color: "#eab308" },
  premium: { label: "Premium", color: "#3b82f6" },
  "high-demand": { label: "High Demand", color: "#ef4444" },
} as const;
