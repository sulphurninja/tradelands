import { Schema, models, model } from "mongoose";

const SeriesPointSchema = new Schema(
  {
    year: { type: Number, required: true },
    pricePerSqFt: { type: Number, required: true },
  },
  { _id: false }
);

const MarketLocationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    changePct: { type: Number, default: 0 },
    series: { type: [SeriesPointSchema], default: [] },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MarketLocation =
  models.MarketLocation || model("MarketLocation", MarketLocationSchema);
