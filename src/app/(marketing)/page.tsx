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
import { BuySellLandSection } from "@/components/home/buy-sell-land-section";
import { MarketSnapshotStrip } from "@/components/market/market-snapshot";
import { TradeLandsIndexPanel } from "@/components/market/tradelands-index-panel";
import { LandPerformanceChart } from "@/components/market/land-performance-chart";
import { UpcomingLandDrops } from "@/components/market/upcoming-land-drops";
import { AssetCard } from "@/components/market/asset-card";
import {
  getBlogs,
  getConcepts,
  getFeaturedProjects,
  getMedia,
  getOffers,
  getProjects,
  getProjectsByStatus,
  getReviews,
} from "@/lib/queries";
import { isVideoUrl } from "@/lib/media";
import {
  getDeskIndexItems,
  getDeskLocations,
} from "@/lib/tradeland-listings";
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
  ]);

  const deskIndices = getDeskIndexItems();
  const deskLocations = getDeskLocations();

  const newLaunches = await getProjectsByStatus("new-launch");
  const trending = [...trendingRaw, ...newLaunches]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 3);

  const pool = featured.length ? featured : all;
  const poster =
    pool.find((p) => p.coverImage && !isVideoUrl(p.coverImage))?.coverImage ||
    undefined;

  const heroFromAdmin = media
    .filter((m) => m.category === "hero" && m.url)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const slides: HeroSlide[] = heroFromAdmin.length
    ? heroFromAdmin.map((m) => {
        const video =
          m.type === "video" || m.type === "drone" || isVideoUrl(m.url);
        return {
          id: `hero-${m.id}`,
          src: m.url,
          poster: video ? poster : undefined,
          title: video ? "" : m.title || m.alt || "",
          kind: video
            ? m.type === "drone"
              ? "drone"
              : "hero"
            : "image",
        };
      })
    : [
        {
          id: "site-hero-video",
          src: "/hero.mp4",
          poster,
          title: "",
          kind: "hero" as const,
        },
      ];

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
      <HomeHero slides={slides} trending={trendingOptions} />
      <BuySellLandSection />
      <MarketSnapshotStrip items={deskIndices} locations={deskLocations} />

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
          <TradeLandsIndexPanel items={deskIndices} layout="rail" />
        </div>
      </section>

      <TrendingStrip
        projects={trending.length ? trending : all.slice(0, 3)}
      />
      <UpcomingLandDrops projects={upcoming.length ? upcoming : all} />
      <LandPerformanceChart locations={deskLocations} />
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
