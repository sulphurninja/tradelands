import { PageHero } from "@/components/layout/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjectsByStatus } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upcoming Projects",
};

export default async function UpcomingProjectsPage() {
  const upcoming = await getProjectsByStatus("upcoming");

  return (
    <>
      <PageHero
        eyebrow="Pipeline"
        title="Upcoming launches"
        description="Early pricing on projects preparing to launch."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
