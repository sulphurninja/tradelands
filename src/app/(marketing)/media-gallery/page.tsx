import { PageHero } from "@/components/layout/page-hero";
import { SmartMedia } from "@/components/media/smart-media";
import { getMedia } from "@/lib/queries";
import { isVideoUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Gallery",
};

export default async function MediaGalleryPage() {
  const media = await getMedia();
  const gallery = media.filter(
    (m) =>
      (m.featured || m.category === "gallery") &&
      (m.type === "image" || m.type === "drone" || m.type === "video")
  );

  return (
    <>
      <PageHero
        eyebrow="Media Centre"
        title="Images, drone, and progress"
        description="Project imagery, drone clips, construction updates, and press — managed from admin."
        compact
      />
      <section className="container-premium section-pad pb-24">
        {gallery.length === 0 ? (
          <p className="text-muted-foreground">
            No gallery media yet. Add items in Admin → Media & Docs.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => {
              const playable =
                item.type === "video" ||
                item.type === "drone" ||
                isVideoUrl(item.url);
              return (
                <figure key={item.id} className="min-w-0">
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                    <SmartMedia
                      src={item.url}
                      alt={item.alt || item.title}
                      fill
                      controls={playable}
                      playsInline
                      objectFit={playable ? "contain" : "cover"}
                    />
                  </div>
                  <figcaption className="mt-2 flex items-start justify-between gap-2 text-sm text-muted-foreground">
                    <span className="min-w-0 break-words">{item.title}</span>
                    {playable ? (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary uppercase">
                        {item.type === "drone" ? "Drone" : "Video"}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
