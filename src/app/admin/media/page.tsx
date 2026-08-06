import { getMedia } from "@/lib/queries";
import { MediaManager } from "@/components/admin/media-manager";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Media" };

export default async function AdminMediaPage() {
  const media = await getMedia();
  return (
    <div>
      <PortalPageHeader
        title="Media & documents"
        description="Upload images, drone clips, brochures, and legal files via Cloudinary."
      />
      <MediaManager initial={media} />
    </div>
  );
}
