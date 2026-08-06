import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { getConcepts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Investment Concepts",
};

export default async function InvestmentConceptsPage() {
  const concepts = await getConcepts();

  return (
    <>
      <PageHero
        eyebrow="Investment Concepts"
        title="AVENZA · ORLANE · FLORAVE"
        description="Three simple models — plantation, NA villas, and farm houses."
        crumbs={[{ href: "/investment-concepts", label: "Concepts" }]}
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-8">
          {concepts.map((concept, i) => (
            <Link
              key={concept.id}
              href={`/investment-concepts/${concept.slug}`}
              className={`group grid overflow-hidden rounded-[1.75rem] ring-1 ring-border/70 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[280px] lg:min-h-[360px]">
                <Image
                  src={concept.coverImage}
                  alt={concept.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center bg-card p-8 sm:p-12">
                <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
                  {concept.brand}
                </p>
                <h2 className="font-display mt-3 text-4xl">{concept.name}</h2>
                <p className="mt-3 text-muted-foreground">{concept.tagline}</p>
                <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-foreground/80">
                  {concept.overview}
                </p>
                <span className="mt-8 inline-flex h-10 items-center text-sm font-medium text-primary">
                  Explore concept →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
