import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeProject } from "@/lib/serialize";
import type { Project } from "@/lib/types";
import { ProjectModel } from "@/models/Project";
import { User } from "@/models/User";
import { ProjectCard } from "@/components/projects/project-card";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/wishlist");

  await connectDB();
  const user = await User.findById(session.sub).select("wishlist").lean();
  const slugs = ((user?.wishlist || []) as string[]).map(String);
  const docs = slugs.length
    ? await ProjectModel.find({ slug: { $in: slugs } }).lean()
    : [];
  const bySlug = new Map<string, Project>(
    docs.map((d) => [String(d.slug), serializeProject(d as never)])
  );
  const projects = slugs
    .map((s: string) => bySlug.get(s))
    .filter((p): p is Project => Boolean(p));

  return (
    <div>
      <PortalPageHeader
        title="Wishlist"
        description="Projects you saved for later."
        actions={
          <Button asChild variant="outline">
            <Link href="/projects">Browse projects</Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <PortalPanel>
          <p className="text-muted-foreground">
            No saved projects yet. Tap the heart on any project card to add it
            here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Go to home</Link>
          </Button>
        </PortalPanel>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
