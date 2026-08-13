import { PageHero } from "@/components/layout/page-hero";
import { DualRowGallery } from "@/components/media/dual-row-gallery";
import { getMedia } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Gallery",
};

export default async function MediaGalleryPage() {
  const media = await getMedia();
  const gallery = media
    .filter(
      (m) =>
        (m.featured || m.category === "gallery") &&
        (m.type === "image" || m.type === "drone" || m.type === "video")
    )
    .map((m) => ({
      id: m.id,
      title: m.title,
      url: m.url,
      alt: m.alt,
      type: m.type,
    }));

  return (
    <>
      <PageHero
        eyebrow="Media Centre"
        title="Images, drone, and progress"
        description="Scroll the page — the top row drifts left, the bottom drifts right. Content is managed in Admin → Media."
        compact
      />
      <section className="section-pad pb-24">
        <div className="container-premium mb-8">
          <p className="max-w-2xl text-sm text-muted-foreground">
            Featured and gallery media from the library. Add or reorder items in
            the admin media manager.
          </p>
        </div>
        {gallery.length === 0 ? (
          <p className="container-premium text-muted-foreground">
            No gallery media yet. Add items in Admin → Media & Docs.
          </p>
        ) : (
          <DualRowGallery items={gallery} />
        )}
      </section>
    </>
  );
}
