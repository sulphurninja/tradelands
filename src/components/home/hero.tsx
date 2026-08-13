"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { LandSearchSection } from "@/components/home/land-search-section";
import { SmartMedia } from "@/components/media/smart-media";
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
  const [muted, setMuted] = useState(true);

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

  useEffect(() => {
    setMuted(true);
  }, [current.id]);

  return (
    <section className="overflow-x-clip bg-background pt-14 sm:pt-16">
      <div
        className="relative w-full bg-background"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full"
            >
              <SmartMedia
                src={current.src}
                alt={current.title}
                priority={index === 0}
                autoPlay={isVideo}
                muted={muted}
                loop
                controls={false}
                playsInline
                poster={current.poster}
                objectFit="contain"
                className="block h-auto w-full"
              />
            </motion.div>
          </AnimatePresence>

          {/* Readable base for overlaid copy */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%] bg-gradient-to-t from-black/75 via-black/35 to-transparent sm:h-[38%]"
          />

          {isVideo ? (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="absolute top-3 right-3 z-20 inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 text-xs font-medium text-white backdrop-blur-md sm:top-5 sm:right-5 sm:h-10 sm:px-3.5 sm:text-[13px]"
            >
              {muted ? (
                <>
                  <VolumeX className="size-3.5 sm:size-4" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5 sm:size-4" />
                  <span>Mute</span>
                </>
              )}
            </button>
          ) : null}

          {items.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md hover:bg-black/70 sm:left-4 sm:size-10"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(1)}
                className="absolute top-1/2 right-2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md hover:bg-black/70 sm:right-4 sm:size-10"
              >
                <ChevronRight className="size-4 sm:size-5" />
              </button>
            </>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 text-center sm:px-8 sm:pb-7 sm:pt-16">
            <div className="mx-auto max-w-3xl">
              <p className="mb-1 text-[10px] font-medium tracking-[0.14em] text-white/70 uppercase sm:mb-1.5 sm:text-xs">
                TradeLands.IND
              </p>
              <h1 className="px-1 text-[1.125rem] leading-[1.2] font-semibold tracking-[-0.03em] text-balance break-words text-white sm:text-3xl lg:text-4xl xl:text-[2.75rem]">
                {current.title}
              </h1>
              {current.subtitle ? (
                <p className="mx-auto mt-1 max-w-xl px-1 text-[12px] leading-snug text-white/80 sm:mt-2 sm:text-base lg:text-lg">
                  {current.subtitle}
                </p>
              ) : null}
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] sm:mt-4 sm:gap-5 sm:text-[15px]">
                {current.href ? (
                  <Link
                    href={current.href}
                    className="font-medium text-white transition-opacity hover:opacity-80"
                  >
                    Learn more ›
                  </Link>
                ) : null}
                <Link
                  href="/book-site-visit"
                  className="font-medium text-white/90 transition-opacity hover:opacity-80"
                >
                  Book a visit ›
                </Link>
              </div>

              {items.length > 1 ? (
                <div className="mt-3 flex items-center justify-center gap-1.5 sm:mt-5 sm:gap-2">
                  {items.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === index
                          ? "w-5 bg-white sm:w-6"
                          : "w-1.5 bg-white/40 hover:bg-white/65"
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <LandSearchSection className="mt-2 pb-8 sm:mt-4" />
    </section>
  );
}
