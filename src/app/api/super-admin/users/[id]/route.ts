import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeUser } from "@/lib/users";
import { User } from "@/models/User";

interface Props {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  role: z.enum(["customer", "sales", "admin", "superadmin"]).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export async function GET(_request: Request, { params }: Props) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  await connectDB();
  const user = await User.findById(id).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: serializeUser(user as never) });
}

export async function PUT(request: Request, { params }: Props) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    const body = updateSchema.parse(await request.json());
    await connectDB();

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.role && body.role !== "superadmin" && user.role === "superadmin") {
      const superCount = await User.countDocuments({
        role: "superadmin",
        active: true,
      });
      if (superCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last active super admin." },
          { status: 400 }
        );
      }
    }

    if (body.active === false && user.role === "superadmin") {
      const superCount = await User.countDocuments({
        role: "superadmin",
        active: true,
      });
      if (superCount <= 1) {
        return NextResponse.json(
          { error: "Cannot deactivate the last active super admin." },
          { status: 400 }
        );
      }
    }

    if (body.active === false && auth.session.sub === id) {
      return NextResponse.json(
        { error: "You cannot deactivate your own account." },
        { status: 400 }
      );
    }

    if (body.name !== undefined) user.name = body.name;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.role !== undefined) user.role = body.role;
    if (body.active !== undefined) user.active = body.active;
    if (body.password) user.passwordHash = await hashPassword(body.password);

    await user.save();
    return NextResponse.json({ user: serializeUser(user.toObject() as never) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
    }
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Unable to update user." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  if (auth.session.sub === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role === "superadmin") {
    const superCount = await User.countDocuments({ role: "superadmin" });
    if (superCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last super admin." },
        { status: 400 }
      );
    }
  }

  await User.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
