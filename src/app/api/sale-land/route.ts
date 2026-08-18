import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { SaleLandListing } from "@/models/SaleLandListing";
import { isCloudinaryConfigured, uploadBuffer } from "@/lib/cloudinary";
import { notifyStaff } from "@/lib/notifications";

const MAX_PHOTOS = 5;
const MAX_DOCS = 5;
const MAX_BYTES = 6 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const DOC_TYPES = new Set([
  ...IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fieldsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(20)
    .regex(/^[+\d][\d\s()-]{8,}$/, "Enter a valid phone number"),
  landSize: z.string().trim().min(1).max(80),
  pinLocation: z.string().trim().min(5).max(500),
  rate: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  source: z.string().trim().max(80).optional(),
});

async function uploadMany(
  files: File[],
  folder: string,
  resourceType: "image" | "auto"
) {
  const urls: string[] = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadBuffer(bytes, {
      folder,
      filename: file.name,
      resourceType,
    });
    urls.push(uploaded.secureUrl);
  }
  return urls;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const parsed = fieldsSchema.safeParse({
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      landSize: String(form.get("landSize") || ""),
      pinLocation: String(form.get("pinLocation") || ""),
      rate: String(form.get("rate") || ""),
      notes: String(form.get("notes") || ""),
      source: String(form.get("source") || ""),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Please fill name, phone, land size, and location correctly.",
        },
        { status: 400 }
      );
    }

    const photos = form
      .getAll("photos")
      .filter((f): f is File => f instanceof File && f.size > 0);
    const documents = form
      .getAll("documents")
      .filter((f): f is File => f instanceof File && f.size > 0);

    if (photos.length === 0 && documents.length === 0) {
      return NextResponse.json(
        { error: "Please upload at least one photo or document." },
        { status: 400 }
      );
    }
    if (photos.length > MAX_PHOTOS) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_PHOTOS} photos.` },
        { status: 400 }
      );
    }
    if (documents.length > MAX_DOCS) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_DOCS} documents.` },
        { status: 400 }
      );
    }

    for (const file of photos) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "Each photo must be under 6MB." },
          { status: 400 }
        );
      }
      if (file.type && !IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Photos must be JPG, PNG, or WebP." },
          { status: 400 }
        );
      }
    }

    for (const file of documents) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "Each document must be under 6MB." },
          { status: 400 }
        );
      }
      if (file.type && !DOC_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Documents must be PDF, DOC, or image files." },
          { status: 400 }
        );
      }
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Upload is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    const photoUrls = await uploadMany(
      photos,
      "tradelands/sale-land/photos",
      "image"
    );
    const documentUrls = await uploadMany(
      documents,
      "tradelands/sale-land/docs",
      "auto"
    );

    await connectDB();
    const doc = await SaleLandListing.create({
      name: parsed.data.name,
      phone: parsed.data.phone,
      landSize: parsed.data.landSize,
      pinLocation: parsed.data.pinLocation,
      rate: parsed.data.rate || undefined,
      notes: parsed.data.notes || undefined,
      photos: photoUrls,
      documents: documentUrls,
      status: "new",
      source: parsed.data.source || "homepage-sale-land",
    });

    await notifyStaff({
      title: "New sell-land submission",
      body: `${parsed.data.name} · ${parsed.data.phone} · ${parsed.data.landSize} · ${parsed.data.pinLocation}`,
      href: "/admin/sale-land",
      type: "lead",
    }).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      id: doc._id.toString(),
      message: "A member of our team will contact you shortly.",
    });
  } catch (error) {
    console.error("Sell land submit error:", error);
    return NextResponse.json(
      { error: "Unable to submit right now. Please try again." },
      { status: 500 }
    );
  }
}
