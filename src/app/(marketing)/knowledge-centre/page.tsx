import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";

const guides = [
  { title: "Agriculture Guides", href: "/blogs", desc: "Soil, water, and plantation fundamentals." },
  { title: "NA Plot Guide", href: "/blogs/na-vs-agriculture-land", desc: "Conversion, permissions, and build rights." },
  { title: "Farm House Guide", href: "/farm-houses", desc: "Typologies, costs, and timelines." },
  { title: "Investment Guide", href: "/why-invest", desc: "Capital allocation frameworks for land." },
  { title: "Legal Guide", href: "/blogs/how-to-read-a-7-12-extract", desc: "7/12, mutation, title, and approvals." },
  { title: "Tax & Policy", href: "/legal-documents", desc: "Stamp duty, policies, and compliance notes." },
];

export const metadata = {
  title: "Knowledge Centre",
};

export default function KnowledgeCentrePage() {
  return (
    <>
      <PageHero
        eyebrow="Knowledge Centre"
        title="Learn before you buy"
        description="Guides, articles, videos, and FAQs covering agriculture, NA plots, farm houses, legal, and tax."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className="group rounded-2xl border border-border/70 p-6 transition-colors hover:border-primary/35 hover:bg-primary/4"
            >
              <h2 className="font-display text-2xl group-hover:text-primary">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
