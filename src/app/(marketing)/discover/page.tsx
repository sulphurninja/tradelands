import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { LocationPath } from "@/components/market/location-path";
import { TradeLandsIndexPanel } from "@/components/market/tradelands-index-panel";
import { LandPerformanceChart } from "@/components/market/land-performance-chart";
import { Button } from "@/components/ui/button";
import { getConcepts } from "@/lib/queries";
import { getDeskIndexItems } from "@/lib/tradeland-listings";
import {
  getMarketCorridorOptions,
  getMarketLocations,
} from "@/lib/market-corridors";

export const dynamic = "force-dynamic";
export const metadata = { title: "Discover" };

export default async function DiscoverPage() {
  const concepts = await getConcepts();
  const corridors = getMarketCorridorOptions();
  const locations = getMarketLocations();
  const indices = getDeskIndexItems();

  return (
    <>
      <PageHero
        eyebrow="Discover"
        title="Locations & concepts"
        description="Pick a Maharashtra location, read the index, and explore investment brands."
        crumbs={[{ href: "/discover", label: "Discover" }]}
        compact
      />
      <section className="container-premium section-pad pb-10">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <LocationPath corridors={corridors} />
          <div>
            <h2 className="text-xl font-semibold">Investment concepts</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {concepts.map((c) => (
                <Link
                  key={c.id}
                  href={`/investment-concepts/${c.slug}`}
                  className="rounded-2xl border border-border p-4 transition hover:border-primary/40"
                >
                  <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                    {c.brand}
                  </p>
                  <p className="mt-1 font-semibold">{c.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.tagline}
                  </p>
                </Link>
              ))}
            </div>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/map">Explore land on map</Link>
            </Button>
          </div>
          <TradeLandsIndexPanel items={indices} />
        </div>
      </section>
      <LandPerformanceChart locations={locations} />
    </>
  );
}
