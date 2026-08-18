import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { AssetCard } from "@/components/market/asset-card";
import { LocationPath } from "@/components/market/location-path";
import { MarketFilter } from "@/components/market/market-filter";
import { TradeLandsIndexPanel } from "@/components/market/tradelands-index-panel";
import { getProjects } from "@/lib/queries";
import { getDeskIndexItems } from "@/lib/tradeland-listings";
import {
  getMarketCorridorOptions,
  projectMatchesCorridor,
} from "@/lib/market-corridors";
import {
  isBulkDealProject,
  projectAcreBounds,
} from "@/lib/bulk-deals";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Market" };

interface Props {
  searchParams: Promise<{
    q?: string;
    location?: string;
    budget?: string;
    category?: string;
    size?: string;
    attribute?: string;
    featured?: string;
    bulk?: string;
  }>;
}

function filterProjects(
  all: Project[],
  params: Awaited<Props["searchParams"]>
) {
  const bulk = params.bulk === "1";
  return all.filter((p) => {
    if (bulk && !isBulkDealProject(p)) return false;
    if (params.featured && !p.featured) return false;
    if (params.category && p.category !== params.category) return false;
    if (
      params.attribute &&
      !p.attributes?.includes(params.attribute as Project["attributes"][number])
    ) {
      return false;
    }
    if (params.budget) {
      const [min, max] = params.budget.split("-").map(Number);
      if (
        Number.isFinite(min) &&
        Number.isFinite(max) &&
        (p.pricing.minPrice > max || p.pricing.maxPrice < min)
      ) {
        return false;
      }
    }
    if (params.size) {
      const [min, max] = params.size.split("-").map(Number);
      const { minAcre, maxAcre } = projectAcreBounds(p);
      if (
        Number.isFinite(min) &&
        Number.isFinite(max) &&
        (maxAcre < min || minAcre > max)
      ) {
        return false;
      }
    } else if (bulk) {
      // Default bulk band: parcels that touch 25–100 acres
      const { minAcre, maxAcre } = projectAcreBounds(p);
      if (maxAcre < 25 || minAcre > 100) return false;
    }
    if (params.location) {
      if (!projectMatchesCorridor(p, params.location)) return false;
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      const hay =
        `${p.name} ${p.tagline} ${p.location.village} ${p.location.district}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function rankProjects(projects: Project[]) {
  return [...projects].sort((a, b) => {
    const aImg = a.coverImage ? 1 : 0;
    const bImg = b.coverImage ? 1 : 0;
    if (bImg !== aImg) return bImg - aImg;
    const aTl = a.slug.startsWith("tl-") ? 1 : 0;
    const bTl = b.slug.startsWith("tl-") ? 1 : 0;
    if (bTl !== aTl) return bTl - aTl;
    if (Number(b.featured) !== Number(a.featured)) {
      return Number(b.featured) - Number(a.featured);
    }
    return 0;
  });
}

export default async function MarketPage({ searchParams }: Props) {
  const params = await searchParams;
  const bulk = params.bulk === "1";
  const all = await getProjects();
  const corridors = getMarketCorridorOptions();
  const indices = getDeskIndexItems();
  const liveCorridors = corridors.filter((c) => !c.comingSoon);

  // Ignore coming-soon location query
  const locationSlug =
    params.location &&
    liveCorridors.some((c) => c.slug === params.location)
      ? params.location
      : undefined;

  const filtered = rankProjects(
    filterProjects(all, { ...params, location: locationSlug })
  );
  const activeCorridor = locationSlug
    ? liveCorridors.find((c) => c.slug === locationSlug)?.name
    : null;

  return (
    <>
      <PageHero
        eyebrow={bulk ? "Bulk land desk" : "Institutional land desk"}
        title={bulk ? "Bulk deals" : "Market"}
        description={
          bulk
            ? "Large parcels from the TradeLands desk inventory — agriculture and NA land across live locations, sized 25–100 acres with budgets from ₹25L to ₹5 Cr."
            : "Curated Maharashtra parcels with corridor rates, growth signals, and clear sizing — built for serious land allocation."
        }
        crumbs={[
          { href: "/market", label: "Market" },
          ...(bulk
            ? [{ href: "/market?bulk=1", label: "Bulk deals" }]
            : []),
        ]}
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
        compact
      />

      <section className="border-b border-border bg-background">
        <div className="container-premium section-pad py-6 sm:py-8">
          <Suspense
            fallback={
              <div className="h-28 animate-pulse rounded-xl bg-muted" />
            }
          >
            <MarketFilter
              locations={liveCorridors.map((l) => ({
                slug: l.slug,
                name: l.name,
              }))}
            />
          </Suspense>
        </div>
      </section>

      <section className="bg-muted/25">
        <div className="container-premium section-pad py-10 pb-20 sm:py-12 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-12">
            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              <LocationPath
                corridors={corridors}
                activeSlug={locationSlug}
                preserveParams={bulk ? { bulk: "1" } : undefined}
              />
              <div className="hidden lg:block">
                <TradeLandsIndexPanel items={indices} />
              </div>
            </aside>

            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    {bulk
                      ? activeCorridor
                        ? `${activeCorridor} · bulk`
                        : "Bulk desk inventory"
                      : activeCorridor
                        ? `${activeCorridor}`
                        : "All live locations"}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                    {filtered.length} asset
                    {filtered.length === 1 ? "" : "s"}
                  </h2>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {bulk
                    ? "Desk inventory · no contact numbers shown"
                    : "Desk rates · indicative growth"}
                </p>
              </div>

              {filtered.length ? (
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {filtered.map((project) => (
                    <AssetCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
                  <p className="text-base font-medium">No matching assets</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Clear filters or pick another location to continue.
                  </p>
                </div>
              )}

              <div className="mt-10 max-w-md lg:hidden">
                <TradeLandsIndexPanel items={indices} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
