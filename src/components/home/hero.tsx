"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
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
    kind: "image",
  },
  {
    id: "fallback-2",
    src: "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-lush-green-landscape-5725/1080p.mp4",
    poster:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    title: "Aerial view",
    kind: "drone",
  },
];

export function HomeHero({
  slides,
  trending = [],
}: {
  slides?: HeroSlide[];
  trending?: { slug: string; name: string; locationLabel?: string }[];
}) {
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

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:h-[48%]"
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
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute top-1/2 left-2 z-40 flex size-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md hover:bg-black/70 sm:left-4 sm:size-11"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute top-1/2 right-2 z-40 flex size-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md hover:bg-black/70 sm:right-4 sm:size-11"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-5 pt-12 text-center sm:px-8 sm:pb-8 sm:pt-16">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-[1.15rem] leading-[1.15] font-bold tracking-[0.04em] text-balance text-white uppercase sm:text-3xl lg:text-4xl xl:text-[2.65rem]">
                Land is the new asset class.
              </h1>
              <p className="mt-1.5 text-[13px] font-semibold text-white sm:mt-2.5 sm:text-lg lg:text-xl">
                Discover. Compare. Invest. Track.
              </p>
              <p className="mx-auto mt-1.5 max-w-xl text-[11px] leading-snug text-white/80 sm:mt-2 sm:text-sm lg:text-[15px]">
                Premium land opportunities across Maharashtra, curated for
                investors, land buyers and future-focused wealth builders.
              </p>
              <div className="pointer-events-auto mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-3">
                <Link
                  href="/market"
                  className="btn-on-dark inline-flex h-9 items-center rounded-full px-4 text-[11px] font-semibold tracking-[0.12em] uppercase sm:h-10 sm:px-5 sm:text-xs"
                >
                  Explore Land
                </Link>
                <Link
                  href="#market-snapshot"
                  className="inline-flex h-9 items-center rounded-full border border-white/40 bg-white/10 px-4 text-[11px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm sm:h-10 sm:px-5 sm:text-xs"
                >
                  View Market
                </Link>
              </div>

              {items.length > 1 ? (
                <div className="pointer-events-auto mt-3 flex items-center justify-center gap-1.5 sm:mt-5 sm:gap-2">
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

              <a
                href="#market-snapshot"
                aria-label="Scroll to market snapshot"
                className="pointer-events-auto mt-3 inline-flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm sm:mt-4 sm:size-10"
              >
                <ChevronDown className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <LandSearchSection className="mt-2 pb-8 sm:mt-4" trending={trending} />
    </section>
  );
}
