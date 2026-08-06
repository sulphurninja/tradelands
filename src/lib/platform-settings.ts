import { SITE } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { PlatformSettings } from "@/models/PlatformSettings";

export type SiteConfig = {
  siteName: string;
  domain: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  supportEmail: string;
  bookingDepositInr: number;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  enableCompare: boolean;
  enableWishlist: boolean;
  enableSiteVisits: boolean;
  seoTitle: string;
  seoDescription: string;
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: SITE.name,
  domain: SITE.domain,
  tagline: SITE.tagline,
  phone: SITE.phone,
  email: SITE.email,
  whatsapp: SITE.whatsapp,
  address: SITE.address,
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
};

export function serializeSettings(doc: Record<string, unknown>): SiteConfig {
  return {
    siteName: String(doc.siteName ?? DEFAULT_SITE_CONFIG.siteName),
    domain: String(doc.domain ?? DEFAULT_SITE_CONFIG.domain),
    tagline: String(doc.tagline ?? DEFAULT_SITE_CONFIG.tagline),
    phone: String(doc.phone ?? DEFAULT_SITE_CONFIG.phone),
    email: String(doc.email ?? DEFAULT_SITE_CONFIG.email),
    whatsapp: String(doc.whatsapp ?? DEFAULT_SITE_CONFIG.whatsapp),
    address: String(doc.address ?? DEFAULT_SITE_CONFIG.address),
    supportEmail: String(doc.supportEmail ?? DEFAULT_SITE_CONFIG.supportEmail),
    bookingDepositInr: Number(
      doc.bookingDepositInr ?? DEFAULT_SITE_CONFIG.bookingDepositInr
    ),
    maintenanceMode: Boolean(doc.maintenanceMode),
    allowRegistrations: doc.allowRegistrations !== false,
    enableCompare: doc.enableCompare !== false,
    enableWishlist: doc.enableWishlist !== false,
    enableSiteVisits: doc.enableSiteVisits !== false,
    seoTitle: String(doc.seoTitle ?? DEFAULT_SITE_CONFIG.seoTitle),
    seoDescription: String(
      doc.seoDescription ?? DEFAULT_SITE_CONFIG.seoDescription
    ),
  };
}

export async function getOrCreatePlatformSettings() {
  await connectDB();
  let doc = await PlatformSettings.findOne({ key: "default" });
  if (!doc) {
    doc = await PlatformSettings.create({
      key: "default",
      ...DEFAULT_SITE_CONFIG,
    });
  }
  return doc;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const doc = await getOrCreatePlatformSettings();
    return serializeSettings(doc.toObject() as Record<string, unknown>);
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}
