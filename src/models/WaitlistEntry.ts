import { Schema, models, model } from "mongoose";

const WaitlistEntrySchema = new Schema(
  {
    projectSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const WaitlistEntry =
  models.WaitlistEntry || model("WaitlistEntry", WaitlistEntrySchema);
