import { Schema, models, model } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectSlug: { type: String, required: true },
    plotId: { type: String, required: true },
    plotNumber: String,
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "confirmed", "cancelled"],
      default: "pending",
    },
    aadhaarUrl: String,
    panUrl: String,
    agreementAccepted: { type: Boolean, default: false },
    paymentId: String,
    receiptUrl: String,
  },
  { timestamps: true }
);

export const Booking = models.Booking || model("Booking", BookingSchema);
