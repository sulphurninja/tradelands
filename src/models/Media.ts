import { Schema, models, model } from "mongoose";

const MediaSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    publicId: String,
    type: {
      type: String,
      enum: ["image", "video", "document", "drone", "other"],
      default: "image",
    },
    category: {
      type: String,
      enum: [
        "gallery",
        "project",
        "blog",
        "concept",
        "legal",
        "brochure",
        "press",
        "event",
        "construction",
        "other",
      ],
      default: "gallery",
    },
    alt: String,
    projectSlug: String,
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Media = models.Media || model("Media", MediaSchema);
