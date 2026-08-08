import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { getProjectsByCategory } from "@/lib/queries";
import type { ProjectCategory } from "@/lib/types";

interface CategoryPageProps {
  category: ProjectCategory;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  extras?: string[];
}

export async function CategoryPage({
  category,
  href,
  eyebrow,
  title,
  description,
  image,
  extras,
}: CategoryPageProps) {
  const list = await getProjectsByCategory(category);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        image={image}
        crumbs={[{ href, label: title }]}
        actions={
          <>
            <Button
              asChild
              className="w-full rounded-full bg-white text-[#0b1610] hover:bg-white/90 sm:w-auto"
            >
              <Link href="/book-site-visit">Book Site Visit</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full border border-white/25 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/projects">All Projects</Link>
            </Button>
          </>
        }
      />

      {extras && extras.length > 0 && (
        <section className="container-premium section-pad border-b border-border/60 bg-background py-6 sm:py-8">
          <div className="flex flex-wrap gap-2">
            {extras.map((item) => (
              <span
                key={item}
                className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm leading-none text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="container-premium section-pad py-12 pb-20 lg:py-16 lg:pb-28">
        {list.length === 0 ? (
          <p className="text-muted-foreground">No projects in this category yet.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
