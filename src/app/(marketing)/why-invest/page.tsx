import { PageHero } from "@/components/layout/page-hero";
import { whyInvest } from "@/lib/content";

export const metadata = {
  title: "Why Invest",
};

export default function WhyInvestPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Invest"
        title="Land as a long-term asset"
        description="Agriculture land and NA plots work well when title, water, access, and use are clear."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {whyInvest.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 p-8"
            >
              <span className="font-display text-4xl text-gold">0{i + 1}</span>
              <h2 className="font-display mt-4 text-2xl">{item.title}</h2>
              <p className="mt-3 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
