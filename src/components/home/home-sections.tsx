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
import type { BlogPost, InvestmentConcept, Project, Review } from "@/lib/types";

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
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-[0.7rem] tracking-[0.28em] text-gold uppercase">
                  {concept.brand}
                </p>
                <h3 className="font-display mt-2 text-3xl text-white">
                  {concept.name}
                </h3>
                <p className="mt-2 text-sm text-white/70">{concept.tagline}</p>
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
            className={`relative overflow-hidden bg-muted ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`}
          >
            <SmartMedia
              src={item.url}
              alt={item.title || ""}
              fill
              controls={item.type === "video" || item.type === "drone"}
              muted
              playsInline
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function BookVisitCta() {
  return (
    <section className="container-premium section-pad py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-black px-8 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-medium tracking-[0.08em] text-[#a1a1a6] uppercase">
            Visit the land
          </p>
          <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] sm:text-[2.75rem] lg:text-[3.25rem]">
            Book a private site visit
          </h2>
          <p className="mt-4 text-[17px] text-[#a1a1a6]">
            Pick a project, date, and pickup. We confirm and guide you on site.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/book-site-visit">Schedule Visit</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Talk to Desk</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
