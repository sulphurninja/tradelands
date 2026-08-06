import { Schema, models, model } from "mongoose";

const SiteVisitSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    projectSlug: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    pickupRequired: { type: Boolean, default: false },
    pickupAddress: String,
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled"],
      default: "requested",
    },
    feedback: String,
  },
  { timestamps: true }
);

export const SiteVisit = models.SiteVisit || model("SiteVisit", SiteVisitSchema);
