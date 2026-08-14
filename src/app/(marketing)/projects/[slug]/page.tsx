import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { getProjectBySlug, getProjectSlugs } from "@/lib/queries";
import { getDeskLocations } from "@/lib/tradeland-listings";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.name,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const locations = getDeskLocations();
  const hay =
    `${project.location.village} ${project.location.taluka} ${project.location.district} ${project.name}`.toLowerCase();
  const marketLocation =
    locations.find((l) => hay.includes(l.name.toLowerCase())) ||
    locations.find((l) => hay.includes(l.slug)) ||
    locations[0] ||
    null;

  return (
    <ProjectDetail project={project} marketLocation={marketLocation} />
  );
}
