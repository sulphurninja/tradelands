import { Schema, models, model } from "mongoose";

const ConceptSchema = new Schema(
  {
    brand: {
      type: String,
      enum: ["AVENZA", "ORLANE", "FLORAVE"],
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: String,
    overview: String,
    benefits: [String],
    businessModel: String,
    investmentPlan: String,
    incomeTimeline: String,
    maintenance: String,
    expectedReturns: String,
    coverImage: String,
    gallery: [String],
    faqs: [{ question: String, answer: String }],
  },
  { timestamps: true }
);

export const Concept = models.Concept || model("Concept", ConceptSchema);
