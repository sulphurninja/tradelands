import { HomeHero } from "@/components/home/hero";
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

  const heroProject =
    featured.find((p) => p.heroVideo) ||
    all.find((p) => p.heroVideo) ||
    featured[0] ||
    all[0];
  const heroFromMedia = media.find(
    (m) =>
      m.featured &&
      (m.type === "video" || m.type === "drone") &&
      Boolean(m.url)
  );
  const heroVideo = heroProject?.heroVideo || heroFromMedia?.url;
  const heroPoster = heroProject?.coverImage;

  return (
    <>
      <HomeHero videoSrc={heroVideo} poster={heroPoster} />
      <FeaturedProjects projects={featured.length ? featured : all.slice(0, 3)} />
      <TrendingStrip
        projects={trending.length ? trending : all.slice(0, 3)}
      />
      {upcoming.length > 0 && (
        <section className="container-premium section-pad py-16">
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/4 px-6 py-8 sm:px-10">
            <p className="text-[0.7rem] tracking-[0.24em] text-primary uppercase">
              Upcoming launch
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl">
                  {upcoming[0].name}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {upcoming[0].tagline} · {upcoming[0].location.district}
                </p>
              </div>
              <a
                href={`/projects/${upcoming[0].slug}`}
                className="inline-flex h-10 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                View details →
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
