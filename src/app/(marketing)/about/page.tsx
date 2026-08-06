import { PageHero } from "@/components/layout/page-hero";

export const metadata = {
  title: "About TradeLands",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About TradeLands"
        title="A clear digital desk for land"
        description="TradeLands.IND helps you understand every project online — pricing, layouts, papers, and booking — before you speak to sales."
        image="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
      />
      <section className="container-premium section-pad py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {[
            {
              title: "Papers first",
              body: "Documents and plot status are shared before persuasion.",
            },
            {
              title: "Premium, simple",
              body: "Calm design, clear CTAs, and project media that helps you decide.",
            },
            {
              title: "End to end",
              body: "From site visit to booking receipt — one investor journey.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-2xl">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
