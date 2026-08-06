export const SITE = {
  name: "TradeLands",
  domain: "TradeLands.IND",
  tagline: "Agriculture land, NA villa plots, and farm houses — clear papers, clear pricing.",
  phone: "+91 98765 43210",
  email: "invest@tradelands.ind",
  whatsapp: "919876543210",
  address: "Pune · Mumbai · Nashik · Hyderabad",
};

export const NAV_LINKS = [
  {
    label: "Invest",
    children: [
      { href: "/agriculture-land", label: "Agriculture Land" },
      { href: "/na-villa-plot", label: "NA Villa Plot" },
      { href: "/farm-houses", label: "Farm Houses" },
      { href: "/investment-concepts", label: "Investment Concepts" },
    ],
  },
  {
    label: "Projects",
    children: [
      { href: "/projects", label: "All Projects" },
      { href: "/upcoming-projects", label: "Upcoming Projects" },
      { href: "/compare", label: "Compare Properties" },
    ],
  },
  {
    label: "Learn",
    children: [
      { href: "/why-invest", label: "Why Invest" },
      { href: "/knowledge-centre", label: "Knowledge Centre" },
      { href: "/blogs", label: "Blogs" },
      { href: "/legal-documents", label: "Legal Documents" },
    ],
  },
  { href: "/media-gallery", label: "Media" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const LOCATION_ATTRIBUTES = [
  { value: "road-touch", label: "Road Touch" },
  { value: "river-touch", label: "River Touch" },
  { value: "lake-view", label: "Lake View" },
  { value: "hill-view", label: "Hill View" },
  { value: "forest", label: "Forest" },
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
