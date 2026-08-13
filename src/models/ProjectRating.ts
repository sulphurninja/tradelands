import { Schema, models, model } from "mongoose";

const ProjectRatingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectSlug: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ProjectRatingSchema.index({ userId: 1, projectSlug: 1 }, { unique: true });

export const ProjectRating =
  models.ProjectRating || model("ProjectRating", ProjectRatingSchema);
