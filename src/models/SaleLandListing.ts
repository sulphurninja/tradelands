import { Schema, models, model } from "mongoose";

const SaleLandListingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    landSize: { type: String, trim: true },
    pinLocation: { type: String, required: true, trim: true },
    rate: { type: String, required: true, trim: true },
    photos: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "new",
        "reviewing",
        "contacted",
        "site-visit",
        "listed",
        "rejected",
        "closed",
      ],
      default: "new",
      index: true,
    },
    adminNotes: { type: String, trim: true },
    assignedTo: String,
    source: { type: String, default: "homepage-sale-land" },
  },
  { timestamps: true }
);

SaleLandListingSchema.index({ createdAt: -1 });
SaleLandListingSchema.index({ phone: 1, createdAt: -1 });

export const SaleLandListing =
  models.SaleLandListing || model("SaleLandListing", SaleLandListingSchema);
