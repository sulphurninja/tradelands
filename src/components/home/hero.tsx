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
    <section className="overflow-x-clip bg-background pt-14 sm:pt-16">
      <div
        className="relative w-full bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Media stage — contain so landscape assets stay fully visible */}
        <div className="relative aspect-video w-full max-w-[100vw] overflow-hidden bg-black sm:aspect-auto sm:min-h-[72svh] lg:min-h-[82svh]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 overflow-hidden"
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

          {items.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur sm:left-6 sm:size-12"
              >
                <ChevronLeft className="size-5 sm:size-6" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(1)}
                className="absolute top-1/2 right-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur sm:right-6 sm:size-12"
              >
                <ChevronRight className="size-5 sm:size-6" />
              </button>
            </>
          ) : null}
        </div>

        {/* Mobile: copy sits below media. Desktop: soft overlay at bottom */}
        <div className="relative z-10 bg-black px-4 pt-4 pb-6 text-center sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-gradient-to-t sm:from-black sm:via-black/85 sm:to-transparent sm:bg-transparent sm:pt-32 sm:pb-10">
          <div className="pointer-events-auto mx-auto max-w-4xl sm:px-6">
            <p className="mb-1.5 text-[11px] font-medium tracking-[0.08em] text-white/55 uppercase sm:mb-2 sm:text-[14px]">
              TradeLands.IND
            </p>
            <h1 className="px-1 text-[1.35rem] leading-[1.15] font-semibold tracking-[-0.03em] break-words text-white sm:text-[3.25rem] lg:text-[4rem]">
              {current.title}
            </h1>
            {current.subtitle ? (
              <p className="mx-auto mt-2 max-w-2xl px-1 text-[13px] leading-snug break-words text-white/70 sm:mt-3 sm:text-[21px]">
                {current.subtitle}
              </p>
            ) : null}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[14px] sm:mt-5 sm:gap-6 sm:text-[19px]">
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
              <div className="mt-4 flex items-center justify-center gap-2 sm:mt-7 sm:gap-2.5">
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
