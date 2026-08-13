import { Schema, models, model } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    projectSlug: String,
    interest: String,
    message: String,
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "site-visit", "booked", "lost"],
      default: "new",
    },
    assignedTo: String,
    agentId: { type: Schema.Types.ObjectId, ref: "User" },
    referralCode: String,
  },
  { timestamps: true }
);

export const Lead = models.Lead || model("Lead", LeadSchema);
