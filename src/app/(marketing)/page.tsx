import { HomeHero, type HeroSlide } from "@/components/home/hero";
import {
  BookVisitCta,
  BlogsPreview,
  FeaturedProjects,
  InvestmentConcepts,
  MediaStrip,
  OffersSection,
  ReviewsSection,
  SuccessStories,
  TrendingStrip,
  WhyChoose,
} from "@/components/home/home-sections";
import { MarketSnapshotStrip } from "@/components/market/market-snapshot";
import { TradeLandsIndexPanel } from "@/components/market/tradelands-index-panel";
import { LandPerformanceChart } from "@/components/market/land-performance-chart";
import { UpcomingLandDrops } from "@/components/market/upcoming-land-drops";
import { AssetCard } from "@/components/market/asset-card";
import {
  getBlogs,
  getConcepts,
  getFeaturedProjects,
  getMarketIndices,
  getMarketLocations,
  getMedia,
  getOffers,
  getProjects,
  getProjectsByStatus,
  getReviews,
} from "@/lib/queries";
import { isVideoUrl } from "@/lib/media";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    featured,
    trendingRaw,
    upcoming,
    concepts,
    blogs,
    reviews,
    offers,
    all,
    media,
    indices,
    locations,
  ] = await Promise.all([
    getFeaturedProjects(),
    getProjectsByStatus("trending"),
    getProjectsByStatus("upcoming"),
    getConcepts(),
    getBlogs(),
    getReviews(),
    getOffers({ activeOnly: true }),
    getProjects(),
    getMedia(),
    getMarketIndices({ activeOnly: true }),
    getMarketLocations({ activeOnly: true }),
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

  const prioritized = [
    ...slides.filter((s) => s.kind === "hero" || s.kind === "drone"),
    ...slides.filter((s) => s.kind === "video"),
    ...slides.filter((s) => s.kind === "image"),
  ].filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const marketAssets = (featured.length ? featured : all).slice(0, 3);
  const trendingOptions = (trending.length ? trending : all.slice(0, 6)).map(
    (p) => ({
      slug: p.slug,
      name: p.name,
      locationLabel: p.location.district,
    })
  );

  return (
    <>
      <HomeHero
        slides={prioritized.slice(0, 8)}
        trending={trendingOptions}
      />
      <MarketSnapshotStrip items={indices} locations={locations} />

      <section className="container-premium section-pad py-16 sm:py-22 lg:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Market Opportunities
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl lg:text-4xl">
              Assets on the desk
            </h2>
          </div>
          <Link
            href="/market"
            className="inline-flex text-sm font-semibold tracking-[0.1em] text-primary uppercase"
          >
            Open full market →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
          {marketAssets.map((p) => (
            <AssetCard key={p.id} project={p} />
          ))}
        </div>

        <div className="mt-6 sm:mt-8">
          <TradeLandsIndexPanel items={indices} layout="rail" />
        </div>
      </section>

      <TrendingStrip
        projects={trending.length ? trending : all.slice(0, 3)}
      />
      <UpcomingLandDrops projects={upcoming.length ? upcoming : all} />
      <LandPerformanceChart locations={locations} />
      <FeaturedProjects projects={featured.length ? featured : all.slice(0, 3)} />
      <InvestmentConcepts concepts={concepts} />
      <OffersSection offers={offers} />
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
