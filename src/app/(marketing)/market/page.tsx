import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { AssetCard } from "@/components/market/asset-card";
import { LocationPath } from "@/components/market/location-path";
import { MarketFilter } from "@/components/market/market-filter";
import { TradeLandsIndexPanel } from "@/components/market/tradelands-index-panel";
import { getMarketIndices, getMarketLocations, getProjects } from "@/lib/queries";
import type { Project } from "@/lib/types";
import { LISTING_BADGE_META } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Market" };

interface Props {
  searchParams: Promise<{
    q?: string;
    location?: string;
    budget?: string;
    category?: string;
    size?: string;
    growth?: string;
    horizon?: string;
    attribute?: string;
    featured?: string;
  }>;
}

function filterProjects(
  all: Project[],
  params: Awaited<Props["searchParams"]>,
  locationNames: Map<string, string>
) {
  return all.filter((p) => {
    if (params.featured && !p.featured) return false;
    if (params.category && p.category !== params.category) return false;
    if (params.horizon && p.investmentHorizon !== params.horizon) return false;
    if (
      params.attribute &&
      !p.attributes?.includes(params.attribute as Project["attributes"][number])
    ) {
      return false;
    }
    if (params.growth) {
      const min = Number(params.growth);
      if (
        Number.isFinite(min) &&
        (p.growthPotentialPct == null || p.growthPotentialPct < min)
      ) {
        return false;
      }
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
      if (
        Number.isFinite(min) &&
        Number.isFinite(max) &&
        (p.area.maxGuntha < min || p.area.minGuntha > max)
      ) {
        return false;
      }
    }
    if (params.location) {
      const name = locationNames.get(params.location)?.toLowerCase() || "";
      const hay =
        `${p.location.village} ${p.location.taluka} ${p.location.district} ${p.name}`.toLowerCase();
      if (name && !hay.includes(name) && !hay.includes(params.location)) {
        return false;
      }
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

export default async function MarketPage({ searchParams }: Props) {
  const params = await searchParams;
  const [all, locations, indices] = await Promise.all([
    getProjects(),
    getMarketLocations({ activeOnly: true }),
    getMarketIndices({ activeOnly: true }),
  ]);
  const locationNames = new Map(locations.map((l) => [l.slug, l.name]));
  const filtered = filterProjects(all, params, locationNames);

  return (
    <>
      <PageHero
        eyebrow="Market"
        title="Market Opportunities"
        description="Land assets framed as financial instruments — filter by corridor, budget, type, size, growth, and horizon."
        crumbs={[{ href: "/market", label: "Market" }]}
        compact
      />
      <section className="container-premium section-pad pb-20">
        <div className="mb-6 flex flex-wrap gap-3 text-xs">
          {Object.entries(LISTING_BADGE_META).map(([key, meta]) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </span>
          ))}
        </div>

        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-2xl bg-muted" />}>
          <MarketFilter
            locations={locations.map((l) => ({
              slug: l.slug,
              name: l.name,
            }))}
          />
        </Suspense>

        <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] xl:gap-14">
          <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
            <LocationPath
              locations={locations}
              activeSlug={params.location}
            />
            <div className="hidden lg:block">
              <TradeLandsIndexPanel items={indices} />
            </div>
          </aside>
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {filtered.length} asset{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:gap-10">
              {filtered.map((project) => (
                <AssetCard key={project.id} project={project} />
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
                No assets match these filters.
              </p>
            ) : null}
            <div className="mt-10 max-w-md lg:hidden">
              <TradeLandsIndexPanel items={indices} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
