import { Schema, models, model } from "mongoose";

const MarketIndexSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    pricePerSqFt: { type: Number, required: true },
    changePct: { type: Number, required: true },
    sortOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MarketIndex =
  models.MarketIndex || model("MarketIndex", MarketIndexSchema);
