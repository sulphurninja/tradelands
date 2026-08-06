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
  },
  { timestamps: true }
);

export const ProjectModel =
  models.Project || model("Project", ProjectSchema);
