import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isCloudinaryConfigured, uploadBuffer } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local",
        },
        { status: 503 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "tradelands");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadBuffer(bytes, {
      folder,
      filename: file.name,
      resourceType: "auto",
    });

    return NextResponse.json({
      url: uploaded.secureUrl,
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType,
      format: uploaded.format,
      bytes: uploaded.bytes,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
