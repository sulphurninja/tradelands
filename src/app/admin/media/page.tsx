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
        description="Upload images, drone clips, and docs. Set category to “Home hero carousel” to control the homepage hero slides (sort order = play order)."
      />
      <MediaManager initial={media} />
    </div>
  );
}
