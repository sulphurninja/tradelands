import mongoose, { Schema, models, model } from "mongoose";
import type { UserRole } from "@/lib/types";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  referralCode?: string;
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "sales", "admin", "superadmin"],
      default: "customer",
    },
    active: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    referralCode: { type: String, trim: true, sparse: true },
    wishlist: [{ type: String }],
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
