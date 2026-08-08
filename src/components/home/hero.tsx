"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertySearch } from "@/components/home/property-search";
import { SmartMedia } from "@/components/media/smart-media";
import { Button } from "@/components/ui/button";
import { isVideoUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  src: string;
  poster?: string;
  title: string;
  subtitle?: string;
  href?: string;
  kind?: "image" | "hero" | "drone" | "video";
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback-1",
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    title: "Agriculture land",
    subtitle: "Clear titles. Clear pricing.",
    href: "/agriculture-land",
    kind: "image",
  },
  {
    id: "fallback-2",
    src: "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-lush-green-landscape-5725/1080p.mp4",
    poster:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    title: "Aerial view",
    subtitle: "See the land from above.",
    href: "/projects",
    kind: "drone",
  },
  {
    id: "fallback-3",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    title: "NA villa plots",
    subtitle: "Ready for your next chapter.",
    href: "/na-villa-plot",
    kind: "image",
  },
];

export function HomeHero({ slides }: { slides?: HeroSlide[] }) {
  const items = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const current = items[index];
  const isVideo = isVideoUrl(current.src);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    if (paused || items.length < 2) return;
    const ms = isVideo ? 9000 : 5000;
    const id = window.setInterval(() => go(1), ms);
    return () => window.clearInterval(id);
  }, [go, items.length, paused, isVideo, index]);

  return (
    <section className="bg-background pt-14 sm:pt-16">
      {/* Black stage — no white letterbox / no white gradient wash */}
      <div
        className="relative w-full bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative min-h-[72svh] w-full sm:min-h-[78svh] lg:min-h-[86svh]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              <SmartMedia
                src={current.src}
                alt={current.title}
                fill
                priority={index === 0}
                autoPlay={isVideo}
                muted
                loop
                controls={false}
                playsInline
                poster={current.poster}
                objectFit="contain"
              />
            </motion.div>
          </AnimatePresence>

          {/* Copy sits in a clean bottom panel — no fog over the video */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pt-28 pb-8 sm:pt-36 sm:pb-10">
            <div className="pointer-events-auto mx-auto max-w-4xl px-5 text-center sm:px-10">
              <p className="mb-2 text-[13px] font-medium tracking-[0.08em] text-white/55 uppercase sm:text-[14px]">
                TradeLands.IND
              </p>
              <h1 className="text-[2.1rem] leading-[1.05] font-semibold tracking-[-0.035em] text-white sm:text-[3.25rem] lg:text-[4rem]">
                {current.title}
              </h1>
              {current.subtitle ? (
                <p className="mx-auto mt-3 max-w-2xl text-[17px] leading-snug text-white/70 sm:text-[21px]">
                  {current.subtitle}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-[17px] sm:text-[19px]">
                {current.href ? (
                  <Link
                    href={current.href}
                    className="font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    Learn more ›
                  </Link>
                ) : null}
                <Link
                  href="/book-site-visit"
                  className="font-medium text-primary transition-opacity hover:opacity-80"
                >
                  Book a visit ›
                </Link>
              </div>

              {items.length > 1 ? (
                <div className="mt-7 flex items-center justify-center gap-2.5">
                  {items.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === index
                          ? "w-7 bg-primary"
                          : "w-2 bg-white/35 hover:bg-white/55"
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-3 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur sm:left-6 sm:size-12"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(1)}
                className="absolute top-1/2 right-3 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur sm:right-6 sm:size-12"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="container-premium section-pad mt-10 pb-8 sm:mt-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Find your land
          </p>
          <p className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-foreground sm:text-[32px]">
            Search projects across India.
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-4xl">
          <PropertySearch />
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="h-11 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/projects">Browse all projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
