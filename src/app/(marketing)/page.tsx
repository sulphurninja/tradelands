import { HomeHero, type HeroSlide } from "@/components/home/hero";
import {
  BookVisitCta,
  BlogsPreview,
  FeaturedProjects,
  InvestmentConcepts,
  MediaStrip,
  ReviewsSection,
  SuccessStories,
  TrendingStrip,
  WhyChoose,
} from "@/components/home/home-sections";
import {
  getBlogs,
  getConcepts,
  getFeaturedProjects,
  getMedia,
  getProjects,
  getProjectsByStatus,
  getReviews,
} from "@/lib/queries";
import { isVideoUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, trendingRaw, upcoming, concepts, blogs, reviews, all, media] =
    await Promise.all([
      getFeaturedProjects(),
      getProjectsByStatus("trending"),
      getProjectsByStatus("upcoming"),
      getConcepts(),
      getBlogs(),
      getReviews(),
      getProjects(),
      getMedia(),
    ]);

  const newLaunches = await getProjectsByStatus("new-launch");
  const trending = [...trendingRaw, ...newLaunches]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 3);

  const pool = featured.length ? featured : all;
  const slides: HeroSlide[] = [];

  for (const p of pool.slice(0, 6)) {
    if (p.heroVideo) {
      slides.push({
        id: `${p.id}-hero`,
        src: p.heroVideo,
        poster: p.coverImage,
        title: p.name,
        subtitle: p.tagline,
        href: `/projects/${p.slug}`,
        kind: "hero",
      });
    }
    if (p.droneVideo) {
      slides.push({
        id: `${p.id}-drone`,
        src: p.droneVideo,
        poster: p.coverImage,
        title: p.name,
        subtitle: p.tagline,
        href: `/projects/${p.slug}`,
        kind: "drone",
      });
    }
    if (p.coverImage && !isVideoUrl(p.coverImage)) {
      slides.push({
        id: `${p.id}-cover`,
        src: p.coverImage,
        title: p.name,
        subtitle: p.tagline,
        href: `/projects/${p.slug}`,
        kind: "image",
      });
    }
  }

  for (const m of media.filter((item) => item.featured).slice(0, 6)) {
    if (!m.url) continue;
    const video = m.type === "video" || m.type === "drone" || isVideoUrl(m.url);
    slides.push({
      id: `media-${m.id}`,
      src: m.url,
      title: m.title || "TradeLands",
      subtitle: "Featured from the gallery",
      href: "/media-gallery",
      kind: m.type === "drone" ? "drone" : video ? "video" : "image",
    });
  }

  // Prefer a mixed set: hero/drone first, then images — cap for UX
  const prioritized = [
    ...slides.filter((s) => s.kind === "hero" || s.kind === "drone"),
    ...slides.filter((s) => s.kind === "video"),
    ...slides.filter((s) => s.kind === "image"),
  ].filter(
    (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i
  );

  return (
    <>
      <HomeHero slides={prioritized.slice(0, 8)} />
      <FeaturedProjects projects={featured.length ? featured : all.slice(0, 3)} />
      <TrendingStrip
        projects={trending.length ? trending : all.slice(0, 3)}
      />
      {upcoming.length > 0 && (
        <section className="container-premium section-pad py-16">
          <div className="rounded-2xl bg-muted px-6 py-8 sm:px-10">
            <p className="text-[12px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Upcoming launch
            </p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.02em] sm:text-[36px]">
                  {upcoming[0].name}
                </h2>
                <p className="mt-2 text-[17px] text-muted-foreground">
                  {upcoming[0].tagline} · {upcoming[0].location.district}
                </p>
              </div>
              <a
                href={`/projects/${upcoming[0].slug}`}
                className="inline-flex h-10 items-center text-[17px] text-primary hover:opacity-80"
              >
                Learn more ›
              </a>
            </div>
          </div>
        </section>
      )}
      <InvestmentConcepts concepts={concepts} />
      <WhyChoose />
      <ReviewsSection reviews={reviews} />
      <SuccessStories />
      <BlogsPreview blogs={blogs.slice(0, 3)} />
      <MediaStrip
        items={media
          .filter(
            (m) =>
              m.type === "image" || m.type === "drone" || m.type === "video"
          )
          .map((m) => ({
            id: m.id,
            url: m.url,
            title: m.title,
            type: m.type,
          }))}
      />
      <BookVisitCta />
    </>
  );
}
