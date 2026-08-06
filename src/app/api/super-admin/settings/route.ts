import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/admin-auth";
import {
  getOrCreatePlatformSettings,
  serializeSettings,
} from "@/lib/platform-settings";

const updateSchema = z.object({
  siteName: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  supportEmail: z.string().email().optional(),
  bookingDepositInr: z.number().min(0).optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistrations: z.boolean().optional(),
  enableCompare: z.boolean().optional(),
  enableWishlist: z.boolean().optional(),
  enableSiteVisits: z.boolean().optional(),
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(1).optional(),
});

export async function GET() {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;

  const doc = await getOrCreatePlatformSettings();
  return NextResponse.json({
    settings: serializeSettings(doc.toObject() as Record<string, unknown>),
  });
}

export async function PUT(request: Request) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = updateSchema.parse(await request.json());
    const doc = await getOrCreatePlatformSettings();

    Object.assign(doc, body, { updatedBy: auth.session.email });
    await doc.save();

    return NextResponse.json({
      settings: serializeSettings(doc.toObject() as Record<string, unknown>),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid settings payload." },
        { status: 400 }
      );
    }
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Unable to update settings." },
      { status: 500 }
    );
  }
}
