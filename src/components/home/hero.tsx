"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearch } from "@/components/home/property-search";
import { SmartMedia } from "@/components/media/smart-media";

const FALLBACK_HERO =
  "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-lush-green-landscape-5725/1080p.mp4";

export function HomeHero({
  videoSrc,
  poster,
}: {
  videoSrc?: string;
  poster?: string;
}) {
  const src = videoSrc || FALLBACK_HERO;

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <SmartMedia
          src={src}
          alt="TradeLands aerial land view"
          fill
          autoPlay
          muted
          loop
          controls={false}
          playsInline
          poster={poster}
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,28,22,0.55)_0%,rgba(12,28,22,0.35)_40%,rgba(12,28,22,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,28,22,0.45)_100%)]" />
      </div>

      <div className="container-premium section-pad relative flex min-h-[100svh] flex-col justify-end pb-10 pt-28 lg:pb-16">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-[0.72rem] tracking-[0.28em] text-gold uppercase"
          >
            Premium land investment in India
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-white"
          >
            Trade<span className="text-gold">Lands</span>
            <span className="block text-[0.55em] font-normal tracking-[0.02em] text-white/85">
              .IND
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Agriculture land, NA villa plots, and farm houses — clear papers,
            clear pricing, and guided site visits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="gradient-emerald text-white">
              <Link href="/projects">
                Explore projects
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/book-site-visit">
                <Play className="size-4" />
                Book site visit
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32 }}
          className="mt-10"
        >
          <PropertySearch />
        </motion.div>
      </div>
    </section>
  );
}
