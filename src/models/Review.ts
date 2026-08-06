import { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    location: String,
    rating: { type: Number, default: 5 },
    quote: String,
    project: String,
  },
  { timestamps: true }
);

export const Review = models.Review || model("Review", ReviewSchema);
