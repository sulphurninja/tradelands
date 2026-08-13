import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ASSIGNABLE_ROLES, serializeUser } from "@/lib/users";
import { User } from "@/models/User";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(["customer", "sales", "admin", "superadmin"]),
  active: z.boolean().optional(),
  referralCode: z.string().optional(),
});

export async function GET(request: Request) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;

  await connectDB();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const q = searchParams.get("q")?.trim();

  const filter: Record<string, unknown> = {};
  if (role && ASSIGNABLE_ROLES.includes(role as never)) {
    filter.role = role;
  }
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users: users.map((u) => serializeUser(u as never)) });
}

export async function POST(request: Request) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = createSchema.parse(await request.json());
    await connectDB();

    const exists = await User.findOne({ email: body.email.toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const referralCode =
      body.referralCode?.trim() ||
      (body.role === "sales"
        ? `TL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        : undefined);

    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      phone: body.phone,
      passwordHash: await hashPassword(body.password),
      role: body.role,
      active: body.active ?? true,
      emailVerified: true,
      referralCode,
      wishlist: [],
    });

    return NextResponse.json(
      { user: serializeUser(user.toObject() as never) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid user payload." }, { status: 400 });
    }
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Unable to create user." }, { status: 500 });
  }
}
