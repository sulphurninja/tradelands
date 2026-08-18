import { Schema, models, model } from "mongoose";

const LandRequirementSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    kmRange: { type: String, required: true, trim: true },
    acres: { type: Number, required: true, min: 5, max: 100 },
    priceRange: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "new",
        "reviewing",
        "contacted",
        "matched",
        "closed",
        "rejected",
      ],
      default: "new",
      index: true,
    },
    adminNotes: { type: String, trim: true },
    source: { type: String, default: "homepage-requirement" },
  },
  { timestamps: true }
);

LandRequirementSchema.index({ createdAt: -1 });
LandRequirementSchema.index({ phone: 1, createdAt: -1 });

export const LandRequirement =
  models.LandRequirement ||
  model("LandRequirement", LandRequirementSchema);
