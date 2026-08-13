import { Schema, models, model } from "mongoose";

const ProjectInterestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    projectSlug: { type: String, required: true, index: true },
    name: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

ProjectInterestSchema.index(
  { userId: 1, projectSlug: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } }
);

export const ProjectInterest =
  models.ProjectInterest || model("ProjectInterest", ProjectInterestSchema);
