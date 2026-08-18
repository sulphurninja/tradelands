import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { LandRequirement } from "@/models/LandRequirement";
import { notifyStaff } from "@/lib/notifications";
import { sendEmail, SALES_INBOX } from "@/lib/email";
import { LIVE_MARKET_CORRIDORS } from "@/lib/market-corridors";

const LOCATION_SLUGS = LIVE_MARKET_CORRIDORS.map((c) => c.slug);
const KM_RANGES = ["0-5", "5-10", "10-25", "25-50", "50-100"] as const;
const PRICE_RANGES = [
  "under-50l",
  "50l-1cr",
  "1cr-3cr",
  "3cr-5cr",
  "5cr-plus",
] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(20)
    .regex(/^[+\d][\d\s()-]{8,}$/, "Enter a valid phone number"),
  location: z.enum(LOCATION_SLUGS as [string, ...string[]]),
  kmRange: z.enum(KM_RANGES),
  acres: z.coerce.number().min(5).max(100),
  priceRange: z.enum(PRICE_RANGES),
  source: z.string().trim().max(80).optional(),
});

const KM_LABELS: Record<string, string> = {
  "0-5": "Within 5 km",
  "5-10": "5–10 km",
  "10-25": "10–25 km",
  "25-50": "25–50 km",
  "50-100": "50–100 km",
};

const PRICE_LABELS: Record<string, string> = {
  "under-50l": "Under ₹50L",
  "50l-1cr": "₹50L – ₹1 Cr",
  "1cr-3cr": "₹1 Cr – ₹3 Cr",
  "3cr-5cr": "₹3 Cr – ₹5 Cr",
  "5cr-plus": "₹5 Cr+",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Please fill name, phone, location, km range, acres (5–100), and price range correctly.",
        },
        { status: 400 }
      );
    }

    const locationName =
      LIVE_MARKET_CORRIDORS.find((c) => c.slug === parsed.data.location)
        ?.name || parsed.data.location;

    await connectDB();
    const doc = await LandRequirement.create({
      ...parsed.data,
      source: parsed.data.source || "homepage-requirement",
    });

    await notifyStaff({
      title: "New land requirement",
      body: `${parsed.data.name} · ${parsed.data.phone} · ${locationName} · ${parsed.data.acres} acres`,
      href: "/admin/requirements",
      type: "lead",
    }).catch(() => undefined);

    await sendEmail({
      to: SALES_INBOX,
      subject: `New land requirement — ${parsed.data.name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h1 style="font-size:20px;margin:0 0 12px">New land requirement</h1>
          <ul>
            <li>Name: ${parsed.data.name}</li>
            <li>Phone: ${parsed.data.phone}</li>
            <li>Location: ${locationName}</li>
            <li>Distance: ${KM_LABELS[parsed.data.kmRange] || parsed.data.kmRange}</li>
            <li>Acres: ${parsed.data.acres}</li>
            <li>Budget: ${PRICE_LABELS[parsed.data.priceRange] || parsed.data.priceRange}</li>
          </ul>
          <p style="color:#777;font-size:13px">Review in Admin → Requirements</p>
        </div>
      `,
      text: `${parsed.data.name} · ${parsed.data.phone} · ${locationName} · ${parsed.data.acres} acres · ${PRICE_LABELS[parsed.data.priceRange]}`,
    }).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      id: doc._id.toString(),
      message: "Requirement received. Our team will contact you shortly.",
    });
  } catch (error) {
    console.error("Land requirement submit error:", error);
    return NextResponse.json(
      { error: "Unable to submit right now. Please try again." },
      { status: 500 }
    );
  }
}
