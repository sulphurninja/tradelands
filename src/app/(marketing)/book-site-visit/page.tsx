import { PageHero } from "@/components/layout/page-hero";
import { SiteVisitForm } from "@/components/forms/site-visit-form";

interface Props {
  searchParams: Promise<{ project?: string }>;
}

export const metadata = {
  title: "Book Site Visit",
};

export default async function BookSiteVisitPage({ searchParams }: Props) {
  const { project } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Online Site Visit"
        title="Schedule a private site visit"
        description="Pick a project and preferred slot. We confirm and meet you on site."
        crumbs={[{ href: "/book-site-visit", label: "Book Visit" }]}
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            {[
              "Project selection with live inventory context",
              "Preferred date & time slots",
              "SMS / WhatsApp confirmation",
              "Post-visit feedback loop",
            ].map((item, i) => (
              <div key={item} className="flex gap-4">
                <span className="font-display text-2xl text-gold">
                  0{i + 1}
                </span>
                <p className="pt-1 text-foreground/85">{item}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-8">
            <SiteVisitForm defaultProject={project} />
          </div>
        </div>
      </section>
    </>
  );
}
