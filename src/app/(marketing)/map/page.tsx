import { PageHero } from "@/components/layout/page-hero";
import { ExploreMap } from "@/components/map/explore-map";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Map" };

export default async function MapPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Spatial desk"
        title="Map"
        description="Explore live Maharashtra assets on an interactive map — tap a photo pin for pricing, corridor context, and the full listing."
        crumbs={[{ href: "/map", label: "Map" }]}
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        compact
      />

      <section className="border-b border-border bg-muted/25">
        <div className="container-premium section-pad py-8 pb-16 sm:py-10 sm:pb-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Explore land
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                Pinned inventory across corridors
              </h2>
            </div>
            <p className="text-[12px] text-muted-foreground">
              Photo pins · desk rates · live corridors
            </p>
          </div>

          <ExploreMap projects={projects} />
        </div>
      </section>
    </>
  );
}
