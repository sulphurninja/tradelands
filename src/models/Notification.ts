import { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    href: String,
    type: {
      type: String,
      enum: ["site-visit", "system", "lead", "offer"],
      default: "system",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification =
  models.Notification || model("Notification", NotificationSchema);
