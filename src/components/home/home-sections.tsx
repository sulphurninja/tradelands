"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/home/section-heading";
import { SmartMedia } from "@/components/media/smart-media";
import { Button } from "@/components/ui/button";
import { successStories, whyInvest } from "@/lib/content";
import type {
  BlogPost,
  InvestmentConcept,
  Offer,
  Project,
  Review,
} from "@/lib/types";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="container-premium section-pad py-20 lg:py-28">
      <SectionHeading
        eyebrow="Featured"
        title="Featured projects"
        description="Selected projects with clear titles, live plots, and full details online."
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/projects">
              <span>View all projects</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.slice(0, 3).map((project, i) => (
          <motion.div
            key={project.id}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
          >
            <ProjectCard
              project={project}
              variant={i === 0 ? "featured" : "default"}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function TrendingStrip({ projects }: { projects: Project[] }) {
  return (
    <section className="border-y border-border/60 bg-muted/50 py-16 lg:py-20">
      <div className="container-premium section-pad">
        <SectionHeading
          eyebrow="Now watching"
          title="Trending & new launches"
          description="Projects buyers are looking at right now."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InvestmentConcepts({
  concepts,
}: {
  concepts: InvestmentConcept[];
}) {
  return (
    <section className="container-premium section-pad py-20 lg:py-28">
      <SectionHeading
        eyebrow="Investment brands"
        title="AVENZA · ORLANE · FLORAVE"
        description="Three clear ways to invest — plantation, NA villas, and farm houses."
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/investment-concepts">
              <span>Explore concepts</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {concepts.map((concept, i) => (
          <motion.div
            key={concept.id}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
          >
            <Link
              href={`/investment-concepts/${concept.slug}`}
              className="group relative block overflow-hidden rounded-2xl ring-1 ring-border/70"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={concept.coverImage}
                  alt={concept.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
                  {concept.brand}
                </p>
                <h3 className="font-display mt-2 text-2xl break-words text-white sm:text-3xl">
                  {concept.name}
                </h3>
                <p className="mt-2 text-sm break-words text-white/70">
                  {concept.tagline}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 gradient-emerald" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.11_85/0.25),transparent_50%)]" />
      <div className="container-premium section-pad relative text-white">
        <SectionHeading
          eyebrow="Why TradeLands"
          title="Built for clear land decisions"
          description="We publish what most sellers keep behind a sales call."
          className="[&_h2]:text-white [&_p]:text-white/70 [&_.mb-3]:text-gold"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyInvest.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.07 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
            >
              <span className="font-display text-3xl text-gold">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-medium leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="container-premium section-pad py-20 lg:py-28">
      <SectionHeading
        eyebrow="Investors"
        title="What buyers say"
        description="Clarity on papers, pricing, and follow-up."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <motion.blockquote
            key={review.id}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="relative rounded-2xl bg-card p-7 ring-1 ring-border/70"
          >
            <Quote className="absolute top-6 right-6 size-8 text-primary/15" />
            <div className="flex gap-1 text-gold">
              {Array.from({ length: review.rating }).map((_, idx) => (
                <Star key={idx} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-foreground/90">
              “{review.quote}”
            </p>
            <footer className="mt-6 border-t border-border/60 pt-4">
              <p className="font-medium leading-none">{review.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {review.location} · {review.project}
              </p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

export function SuccessStories() {
  return (
    <section className="border-y border-border/60 bg-muted/40 py-20 lg:py-24">
      <div className="container-premium section-pad">
        <SectionHeading
          eyebrow="Results"
          title="Success stories"
          align="center"
        />
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {successStories.map((story, i) => (
            <motion.div
              key={story.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-[0.68rem] tracking-[0.2em] text-gold uppercase">
                {story.meta}
              </p>
              <h3 className="font-display mt-3 text-2xl text-balance">
                {story.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {story.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogsPreview({ blogs }: { blogs: BlogPost[] }) {
  return (
    <section className="container-premium section-pad py-20 lg:py-28">
      <SectionHeading
        eyebrow="Guides"
        title="Latest from the desk"
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/blogs">
              <span>All articles</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-3">
        {blogs.map((post, i) => (
          <motion.div
            key={post.id}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.07 }}
          >
            <Link href={`/blogs/${post.slug}`} className="group block">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-[0.68rem] tracking-[0.18em] text-primary uppercase">
                {post.category} · {post.readTime}
              </p>
              <h3 className="font-display mt-2 text-2xl transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function MediaStrip({
  items,
}: {
  items: { id: string; url: string; title?: string; type?: string }[];
}) {
  const fallback: {
    id: string;
    url: string;
    title?: string;
    type?: string;
  }[] = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
  ].map((url, i) => ({ id: `fallback-${i}`, url, type: "image" }));

  const list = (items.length > 0 ? items : fallback).slice(0, 4);

  return (
    <section className="pb-8">
      <div className="container-premium section-pad mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Media"
          title="Land, light, and progress"
          className="mb-0"
        />
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/media-gallery">
            <span>Open gallery</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {list.map((item, i) => (
          <div
            key={item.id}
            className={`relative min-w-0 overflow-hidden bg-black ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`}
          >
            <SmartMedia
              src={item.url}
              alt={item.title || ""}
              fill
              controls={item.type === "video" || item.type === "drone"}
              muted
              playsInline
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function OffersSection({ offers }: { offers: Offer[] }) {
  if (!offers.length) return null;

  const [featured, ...rest] = offers;

  return (
    <section className="bg-muted/45 py-20 lg:py-28">
      <div className="container-premium section-pad">
        <div className="mb-12 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2.5">
              <span className="h-px w-8 bg-primary sm:w-10" />
              <p className="text-[13px] font-semibold tracking-[0.18em] text-primary uppercase">
                Exclusive offers
              </p>
            </div>
            <h2 className="text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance break-words text-foreground sm:text-[3.25rem] lg:text-[3.75rem]">
              Limited packages.
              <span className="mt-1 block text-primary sm:mt-0 sm:inline sm:before:content-['\00a0']">
                Clear benefits.
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
              Launch pricing and time-bound benefits — updated live from the desk.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/projects">
              <span>All projects</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Featured — editorial split, theme tokens only */}
        <motion.article
          {...fadeUp}
          className="grid overflow-hidden rounded-[1.5rem] bg-card lg:grid-cols-2"
        >
          <div className="relative aspect-[4/3] bg-muted lg:aspect-auto lg:min-h-[420px]">
            {featured.image ? (
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 gradient-emerald" />
            )}
            {featured.badge ? (
              <span className="absolute top-5 left-5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-primary-foreground uppercase">
                {featured.badge}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12">
            <p className="text-[12px] font-medium tracking-[0.08em] text-primary uppercase">
              {featured.eyebrow || "Offer"}
              {featured.validUntil ? (
                <span className="text-muted-foreground">
                  {" "}
                  · Till {featured.validUntil}
                </span>
              ) : null}
            </p>
            <h3 className="mt-3 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance break-words text-foreground sm:text-[2.25rem]">
              {featured.title}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {featured.description}
            </p>
            {featured.highlights.length > 0 ? (
              <ul className="mt-6 space-y-2.5">
                {featured.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2.5 text-[14px] text-foreground/90 sm:text-[15px]"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-11 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
              >
                <Link href={featured.ctaHref || "/projects"}>
                  {featured.ctaLabel || "View offer"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.article>

        {rest.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {rest.map((offer, i) => (
              <motion.article
                key={offer.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.08 + i * 0.06 }}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  {offer.image ? (
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 gradient-emerald opacity-80" />
                  )}
                  {offer.badge ? (
                    <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-primary-foreground uppercase">
                      {offer.badge}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
                  <p className="text-[12px] font-medium tracking-[0.08em] text-primary uppercase">
                    {offer.eyebrow || "Offer"}
                    {offer.validUntil ? (
                      <span className="text-muted-foreground">
                        {" "}
                        · Till {offer.validUntil}
                      </span>
                    ) : null}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.02em] text-balance break-words text-foreground">
                    {offer.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                    {offer.description}
                  </p>
                  {offer.highlights.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {offer.highlights.slice(0, 3).map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2.5 text-sm text-foreground/90"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-6">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={offer.ctaHref || "/projects"}>
                        {offer.ctaLabel || "View offer"}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function BookVisitCta() {
  return (
    <section className="container-premium section-pad py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-black px-5 py-12 text-white sm:rounded-[1.75rem] sm:px-12 sm:py-14 lg:px-16 lg:py-20">
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium tracking-[0.08em] text-[#a1a1a6] uppercase">
            Visit the land
          </p>
          <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">
            Book a private site visit
          </h2>
          <p className="mt-4 text-[15px] text-[#a1a1a6] sm:text-[17px]">
            Pick a project, date, and pickup. We confirm and guide you on site.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <Link href="/book-site-visit">Schedule Visit</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/contact">Talk to Desk</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
