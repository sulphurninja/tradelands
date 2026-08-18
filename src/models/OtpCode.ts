import { Schema, models, model } from "mongoose";

const OtpCodeSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    codeHash: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["verify-email", "login", "sale-land"],
      default: "verify-email",
    },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

OtpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpCode = models.OtpCode || model("OtpCode", OtpCodeSchema);
