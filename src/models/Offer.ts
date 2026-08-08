import { Schema, models, model } from "mongoose";

const OfferSchema = new Schema(
  {
    eyebrow: { type: String, default: "Offer" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    badge: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    ctaLabel: { type: String, default: "View offer" },
    ctaHref: { type: String, default: "/projects" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    validUntil: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Offer = models.Offer || model("Offer", OfferSchema);
