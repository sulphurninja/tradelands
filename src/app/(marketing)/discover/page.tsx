import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { LocationPath } from "@/components/market/location-path";
import { TradeLandsIndexPanel } from "@/components/market/tradelands-index-panel";
import { LandPerformanceChart } from "@/components/market/land-performance-chart";
import { Button } from "@/components/ui/button";
import {
  getConcepts,
  getMarketIndices,
  getMarketLocations,
} from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Discover" };

export default async function DiscoverPage() {
  const [locations, indices, concepts] = await Promise.all([
    getMarketLocations({ activeOnly: true }),
    getMarketIndices({ activeOnly: true }),
    getConcepts(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Discover"
        title="Corridors & concepts"
        description="Pick a Maharashtra corridor, read the index, and explore investment brands."
        crumbs={[{ href: "/discover", label: "Discover" }]}
        compact
      />
      <section className="container-premium section-pad pb-10">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <LocationPath locations={locations} />
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
