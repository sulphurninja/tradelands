"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { LandSearchSection } from "@/components/home/land-search-section";
import { SmartMedia } from "@/components/media/smart-media";
import { isVideoUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  kind?: "image" | "hero" | "drone" | "video";
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "site-hero-video",
    src: "/hero.mp4",
    kind: "hero",
  },
];

const IMAGE_INTERVAL_MS = 5500;

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef(0);

  const current = items[index] || items[0];
  const isVideo = isVideoUrl(current?.src || "");

  const scrollToIndex = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollTo({ left: i * el.clientWidth, behavior });
    },
    []
  );

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        const next = (i + dir + items.length) % items.length;
        scrollToIndex(next);
        return next;
      });
    },
    [items.length, scrollToIndex]
  );

  const goTo = useCallback(
    (i: number) => {
      setIndex(i);
      scrollToIndex(i);
    },
    [scrollToIndex]
  );

  useEffect(() => {
    scrollToIndex(0, "auto");
  }, [scrollToIndex, items.length]);

  useEffect(() => {
    const onResize = () => scrollToIndex(index, "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, scrollToIndex]);

  // Images auto-advance. Videos stay until the user swipes or uses arrows.
  useEffect(() => {
    if (paused || items.length < 2 || isVideo) return;
    const id = window.setInterval(() => go(1), IMAGE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [go, items.length, paused, isVideo, index]);

  useEffect(() => {
    setMuted(true);
  }, [current?.id]);

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(() => {
      const next = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
      setIndex(Math.max(0, Math.min(items.length - 1, next)));
    }, 50);
  }

  return (
    <section className="overflow-x-clip bg-black">
      <div
        className="relative h-[100svh] w-screen max-w-[100vw] overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((slide, i) => {
            const video = isVideoUrl(slide.src);
            const active = i === index;
            return (
              <div
                key={slide.id}
                className="relative h-full w-full min-w-full shrink-0 snap-start snap-always"
              >
                <SmartMedia
                  src={slide.src}
                  alt={video ? "" : slide.title || ""}
                  fill
                  priority={i === 0}
                  autoPlay={video && active}
                  muted={muted}
                  loop={video}
                  controls={false}
                  playsInline
                  poster={slide.poster}
                  objectFit="cover"
                  className="!absolute !inset-0 !h-full !w-full !max-w-none object-cover"
                />
              </div>
            );
          })}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48%] bg-gradient-to-t from-black/85 via-black/35 to-transparent"
        />

        {isVideo ? (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute top-[4.75rem] right-4 z-40 flex size-10 touch-manipulation items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md sm:top-24 sm:right-6 sm:size-11"
          >
            {muted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
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
              className="absolute top-1/2 left-2 z-40 flex size-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-md hover:bg-black/70 active:scale-95 sm:left-4 sm:size-12"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute top-1/2 right-2 z-40 flex size-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg backdrop-blur-md hover:bg-black/70 active:scale-95 sm:right-4 sm:size-12"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>
          </>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-8 text-center sm:px-8 sm:pb-10">
          <div className="mx-auto max-w-2xl">
            {/* Brand copy only on image slides — keep video slides clean */}
            {!isVideo ? (
              <>
                <h1 className="text-[1.35rem] leading-[1.12] font-bold tracking-[0.14em] text-balance text-white uppercase sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:tracking-[0.12em]">
                  Land is the new asset class.
                </h1>
                <p className="mx-auto mt-2.5 hidden max-w-lg text-sm text-white/80 sm:mt-3 sm:block sm:text-[15px]">
                  Premium land opportunities across Maharashtra — discover,
                  compare, invest, track.
                </p>
              </>
            ) : null}

            <div
              className={cn(
                "pointer-events-auto flex flex-col items-center gap-4",
                isVideo ? "mt-0" : "mt-5 sm:mt-6"
              )}
            >
              <Link
                href="/market"
                className="inline-flex h-11 min-w-[10.5rem] items-center justify-center rounded-full bg-white px-8 text-[12px] font-semibold tracking-[0.18em] text-neutral-900 uppercase shadow-md sm:h-12 sm:min-w-[12rem] sm:text-[13px]"
              >
                Explore
              </Link>

              {items.length > 1 ? (
                <div className="flex items-center justify-center gap-2">
                  {items.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === index
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/35 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <LandSearchSection
        className="mt-2 bg-background pb-8 sm:mt-4"
        trending={trending}
      />
    </section>
  );
}
