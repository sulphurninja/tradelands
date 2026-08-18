import mongoose, { Schema, models, model } from "mongoose";

export interface IPlatformSettings {
  _id: mongoose.Types.ObjectId;
  key: string;
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
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformSettingsSchema = new Schema<IPlatformSettings>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    siteName: { type: String, default: "TradeLands" },
    domain: { type: String, default: "TradeLands.IND" },
    tagline: {
      type: String,
      default:
        "Agriculture land, NA villa plots, and farm houses — clear papers, clear pricing.",
    },
    phone: { type: String, default: "+917977076969" },
    email: { type: String, default: "invest@tradelands.ind" },
    whatsapp: { type: String, default: "917977076969" },
    address: { type: String, default: "Pune · Mumbai · Nashik · Hyderabad" },
    supportEmail: { type: String, default: "support@tradelands.ind" },
    bookingDepositInr: { type: Number, default: 25000 },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    enableCompare: { type: Boolean, default: true },
    enableWishlist: { type: Boolean, default: true },
    enableSiteVisits: { type: Boolean, default: true },
    seoTitle: {
      type: String,
      default: "TradeLands.IND — Premium Agriculture Land & NA Villa Plots",
    },
    seoDescription: {
      type: String,
      default:
        "Agriculture land, NA villa plots, and farm houses in India — with clear pricing, legal papers, and online booking.",
    },
    updatedBy: String,
  },
  { timestamps: true }
);

export const PlatformSettings =
  models.PlatformSettings ||
  model<IPlatformSettings>("PlatformSettings", PlatformSettingsSchema);
