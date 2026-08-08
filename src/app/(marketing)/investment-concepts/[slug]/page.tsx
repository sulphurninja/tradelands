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
      <section className="relative min-h-[52svh] overflow-hidden pt-20 sm:min-h-[60vh] sm:pt-24">
        <Image
          src={concept.coverImage}
          alt={concept.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-forest/55 to-forest/40" />
        <div className="container-premium section-pad relative flex min-h-[52svh] flex-col justify-end pb-8 sm:min-h-[60vh] sm:pb-12">
          <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
            {concept.brand}
          </p>
          <h1 className="font-display mt-3 text-[2rem] leading-[1.05] break-words text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {concept.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base break-words text-white/75 sm:mt-4 sm:text-lg">
            {concept.tagline}
          </p>
        </div>
      </section>

      <section className="container-premium section-pad py-12 sm:py-16 lg:py-20">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <div className="order-2 min-w-0 lg:order-1">
            <h2 className="font-display text-2xl sm:text-3xl">Overview</h2>
            <p className="mt-4 text-base leading-relaxed break-words text-foreground/90 sm:text-lg">
              {concept.overview}
            </p>
            <h3 className="font-display mt-10 text-2xl sm:mt-12 sm:text-3xl">
              Benefits
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
              {concept.benefits.map((b) => (
                <li
                  key={b}
                  className="min-w-0 rounded-xl bg-muted/70 px-4 py-3 text-sm break-words"
                >
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 grid gap-6 sm:mt-12">
              {blocks.map((block) => (
                <div key={block.title} className="border-t border-border/70 pt-6">
                  <h3 className="text-[0.7rem] tracking-[0.2em] text-primary uppercase">
                    {block.title}
                  </h3>
                  <p className="mt-3 leading-relaxed break-words text-muted-foreground">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>
            <h3 className="font-display mt-10 text-2xl sm:mt-12 sm:text-3xl">
              FAQs
            </h3>
            <Accordion className="mt-4">
              {concept.faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <aside className="order-1 min-w-0 lg:sticky lg:top-28 lg:order-2 lg:self-start">
            <div className="glass rounded-2xl p-5 sm:p-6">
              <p className="font-display text-xl break-words sm:text-2xl">
                {concept.name}
              </p>
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
