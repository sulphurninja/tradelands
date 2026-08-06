import { PageHero } from "@/components/layout/page-hero";
import { Download } from "lucide-react";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Legal Documents",
};

export default async function LegalDocumentsPage() {
  const projects = await getProjects();
  const docs = projects.flatMap((p) =>
    p.documents.map((d) => ({ ...d, project: p.name }))
  );

  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title="Legal documents & brochures"
        description="7/12, title reports, layouts, approvals, and price sheets."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-3">
          {docs.map((doc) => (
            <a
              key={`${doc.project}-${doc.title}`}
              href={doc.url}
              className="flex h-16 items-center justify-between rounded-xl border border-border/70 px-5 transition-colors hover:border-primary/40"
            >
              <div className="min-w-0">
                <p className="truncate font-medium leading-none">{doc.title}</p>
                <p className="mt-1.5 truncate text-sm text-muted-foreground">
                  {doc.project} · {doc.type.replace("-", " ")}
                </p>
              </div>
              <Download className="size-4 shrink-0 text-primary" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
