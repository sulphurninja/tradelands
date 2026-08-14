import { ExploreMap } from "@/components/map/explore-map";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Map · Explore Land" };

export default async function MapPage() {
  const projects = await getProjects();
  return (
    <div className="pt-14 sm:pt-16">
      <ExploreMap projects={projects} />
    </div>
  );
}
