import type { UserRole } from "@/lib/types";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export function serializeUser(doc: {
  _id: { toString(): string };
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}): PublicUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    role: doc.role,
    active: doc.active !== false,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
  };
}

export const ASSIGNABLE_ROLES: UserRole[] = [
  "customer",
  "sales",
  "admin",
  "superadmin",
];
