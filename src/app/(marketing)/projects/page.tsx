import { ProjectCard } from "@/components/projects/project-card";
import { PageHero } from "@/components/layout/page-hero";
import { getProjects } from "@/lib/queries";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    state?: string;
    category?: string;
    budget?: string;
    attribute?: string;
    q?: string;
  }>;
}

function filterProjects(
  all: Project[],
  params: Awaited<Props["searchParams"]>
) {
  return all.filter((p) => {
    if (params.state && p.location.state !== params.state) return false;
    if (params.category && p.category !== params.category) return false;
    if (
      params.attribute &&
      !p.attributes.includes(params.attribute as Project["attributes"][number])
    )
      return false;
    if (params.budget) {
      const [min, max] = params.budget.split("-").map(Number);
      if (p.pricing.minPrice > max || p.pricing.maxPrice < min) return false;
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      const hay =
        `${p.name} ${p.location.village} ${p.location.district}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const all = await getProjects();
  const filtered = filterProjects(all, params);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="All projects"
        description="Browse agriculture land, NA villa plots, and farm houses with clear pricing and papers."
        crumbs={[{ href: "/projects", label: "Projects" }]}
        compact
      />
      <section className="container-premium section-pad pb-20 lg:pb-28">
        <p className="mb-8 text-sm text-muted-foreground">
          {filtered.length} project{filtered.length === 1 ? "" : "s"}
          {params.state || params.category || params.budget || params.attribute
            ? " matching filters"
            : ""}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="font-display text-2xl">No projects match</p>
            <p className="mt-2 text-muted-foreground">
              Try different filters or browse all projects.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
