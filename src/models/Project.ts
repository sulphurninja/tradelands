import mongoose, { Schema, models, model } from "mongoose";

const PlotSchema = new Schema(
  {
    id: String,
    number: String,
    areaGuntha: Number,
    price: Number,
    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
    },
    facing: String,
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tagline: String,
    category: {
      type: String,
      enum: ["agriculture-land", "na-villa-plot", "farm-house"],
      required: true,
    },
    status: [String],
    developmentStage: {
      type: String,
      enum: ["developed", "under-development"],
      default: "under-development",
    },
    viewCount: { type: Number, default: 0 },
    interestCount: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    location: {
      state: String,
      district: String,
      taluka: String,
      village: String,
      address: String,
      lat: Number,
      lng: Number,
    },
    pricing: {
      currency: { type: String, default: "INR" },
      minPrice: Number,
      maxPrice: Number,
      pricePerGuntha: Number,
      pricePerAcre: Number,
      bookingAmount: Number,
    },
    area: {
      minGuntha: Number,
      maxGuntha: Number,
      minAcre: Number,
      maxAcre: Number,
    },
    attributes: [String],
    purposes: [String],
    coverImage: String,
    gallery: [String],
    heroVideo: String,
    droneVideo: String,
    overview: String,
    story: String,
    amenities: [{ name: String, icon: String }],
    highlights: [String],
    connectivity: [String],
    documents: [
      {
        title: String,
        type: String,
        url: String,
      },
    ],
    plots: [PlotSchema],
    appreciation: String,
    legalStatus: String,
    featured: { type: Boolean, default: false },
    listingBadge: {
      type: String,
      enum: ["available", "coming-soon", "premium", "high-demand"],
      default: "available",
    },
    pricePerSqFt: Number,
    growthPotentialPct: Number,
    investmentHorizon: String,
    growth3yPct: Number,
    growth5yPct: Number,
    demandLevel: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    earlyAccess: { type: Boolean, default: false },
    waitlistEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProjectModel =
  models.Project || model("Project", ProjectSchema);
