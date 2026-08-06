import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getConceptBySlug,
  getConceptSlugs,
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getConceptSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const concept = await getConceptBySlug(slug);
  return { title: concept?.name ?? "Concept" };
}

export default async function ConceptDetailPage({ params }: Props) {
  const { slug } = await params;
  const concept = await getConceptBySlug(slug);
  if (!concept) notFound();

  const blocks = [
    { title: "Business model", body: concept.businessModel },
    { title: "Investment plan", body: concept.investmentPlan },
    { title: "Income timeline", body: concept.incomeTimeline },
    { title: "Maintenance", body: concept.maintenance },
    { title: "Expected returns", body: concept.expectedReturns },
  ];

  return (
    <>
      <section className="relative min-h-[60vh] overflow-hidden pt-24">
        <Image
          src={concept.coverImage}
          alt={concept.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-forest/55 to-forest/40" />
        <div className="container-premium section-pad relative flex min-h-[60vh] flex-col justify-end pb-12">
          <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
            {concept.brand}
          </p>
          <h1 className="font-display mt-3 text-5xl text-white sm:text-6xl lg:text-7xl">
            {concept.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            {concept.tagline}
          </p>
        </div>
      </section>

      <section className="container-premium section-pad py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">
              {concept.overview}
            </p>
            <h3 className="font-display mt-12 text-3xl">Benefits</h3>
            <ul className="mt-6 space-y-3">
              {concept.benefits.map((b) => (
                <li
                  key={b}
                  className="rounded-xl bg-muted/70 px-4 py-3 text-sm"
                >
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-12 grid gap-6">
              {blocks.map((block) => (
                <div key={block.title} className="border-t border-border/70 pt-6">
                  <h3 className="text-[0.7rem] tracking-[0.2em] text-primary uppercase">
                    {block.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>
            <h3 className="font-display mt-12 text-3xl">FAQs</h3>
            <Accordion className="mt-4">
              {concept.faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <aside>
            <div className="glass sticky top-28 rounded-2xl p-6">
              <p className="font-display text-2xl">{concept.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask for package sheets and recent case studies.
              </p>
              <div className="mt-6 grid gap-2">
                <Button asChild className="h-11 gradient-emerald text-white">
                  <Link href="/book-site-visit">Book Site Visit</Link>
                </Button>
                <Button asChild variant="outline" className="h-11">
                  <Link href="/contact">Request Brochure</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
