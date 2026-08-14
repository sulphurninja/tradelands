"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Download,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { MarketLocationItem, Project } from "@/lib/types";
import { categoryLabel, formatINR } from "@/lib/format";
import { SITE } from "@/lib/constants";
import { isVideoUrl } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartMedia } from "@/components/media/smart-media";
import { LandSearchSection } from "@/components/home/land-search-section";
import { SiteVisitDialog } from "@/components/forms/site-visit-dialog";
import { WishlistButton } from "@/components/projects/wishlist-button";
import { ProjectEngagement } from "@/components/projects/project-engagement";
import { WaitlistDialog } from "@/components/market/upcoming-land-drops";
import { ProjectCandlestickChart } from "@/components/market/project-candlestick-chart";
import { AssetGrowthMetrics } from "@/components/market/asset-growth-metrics";
import { LISTING_BADGE_META } from "@/lib/constants";

export function ProjectDetail({
  project,
  marketLocation,
}: {
  project: Project;
  marketLocation?: MarketLocationItem | null;
}) {
  const available = project.plots.filter((p) => p.status === "available").length;
  const heroSrc = project.heroVideo || project.coverImage;
  const heroIsVideo = Boolean(project.heroVideo) || isVideoUrl(heroSrc);
  const [muted, setMuted] = useState(true);

  return (
    <article className="overflow-x-clip pb-24 lg:pb-0">
      <section className="overflow-hidden bg-background pt-20 sm:pt-24">
        <div className="relative w-full bg-background">
          <SmartMedia
            src={heroSrc}
            alt={project.name}
            priority
            autoPlay={heroIsVideo}
            muted={muted}
            loop
            controls={false}
            playsInline
            poster={project.coverImage}
            objectFit="contain"
            className="block h-auto w-full"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48%] bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:h-[42%]"
          />

          {heroIsVideo ? (
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

          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-12 sm:px-8 sm:pb-8 sm:pt-16 lg:px-12">
            <div className="mx-auto w-full max-w-[980px] lg:max-w-[1060px] xl:max-w-[1120px]">
              <div className="flex max-w-full flex-wrap gap-1 sm:gap-1.5">
                <Badge className="border-0 bg-white/15 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm sm:text-xs">
                  {categoryLabel(project.category)}
                </Badge>
                {project.status.slice(0, 2).map((s) => (
                  <Badge
                    key={s}
                    className="border-0 bg-primary/90 px-2 py-0.5 text-[10px] text-white capitalize sm:text-xs"
                  >
                    {s.replace("-", " ")}
                  </Badge>
                ))}
              </div>
              <h1 className="mt-1.5 max-w-3xl text-[1.2rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance break-words text-white sm:mt-3 sm:text-4xl lg:text-5xl xl:text-6xl">
                {project.name}
              </h1>
              <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-white/80 sm:mt-2.5 sm:items-center sm:text-sm">
                <MapPin className="mt-0.5 size-3 shrink-0 sm:mt-0 sm:size-3.5" />
                <span className="min-w-0 break-words">
                  {project.location.village}, {project.location.taluka},{" "}
                  {project.location.district}, {project.location.state}
                </span>
              </p>
              <p className="mt-1 max-w-xl text-[12px] leading-snug break-words text-white/75 sm:mt-2 sm:text-base">
                {project.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-premium section-pad py-10 sm:py-12 lg:py-16">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="order-2 min-w-0 space-y-12 sm:space-y-14 lg:order-1">
            <div>
              <p className="text-[0.7rem] tracking-[0.28em] text-primary uppercase">
                Overview
              </p>
              <p className="mt-4 text-base leading-relaxed break-words text-foreground/90 sm:text-lg">
                {project.overview}
              </p>
              <p className="mt-4 leading-relaxed break-words text-muted-foreground">
                {project.story}
              </p>
            </div>

            <ProjectCandlestickChart
              project={project}
              location={marketLocation}
            />

            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl">
                Investment highlights
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex min-w-0 items-start gap-3 rounded-xl bg-muted/70 px-3.5 py-3 text-sm sm:px-4"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 leading-snug break-words">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {project.droneVideo ? (
              <div className="min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl">Drone tour</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aerial walkthrough of the land and surroundings.
                </p>
                <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-2xl bg-black sm:mt-6">
                  <SmartMedia
                    src={project.droneVideo}
                    alt={`${project.name} drone video`}
                    fill
                    controls
                    playsInline
                    poster={project.coverImage}
                    objectFit="contain"
                  />
                </div>
              </div>
            ) : null}

            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl">Gallery</h2>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 md:grid-cols-3">
                {project.gallery.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black"
                  >
                    <SmartMedia
                      src={src}
                      alt=""
                      fill
                      controls={false}
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl">Amenities</h2>
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                {project.amenities.map((a) => (
                  <span
                    key={a.name}
                    className="max-w-full rounded-full border border-border px-3 py-2 text-sm break-words sm:px-4"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl">
                Nearby connectivity
              </h2>
              <ul className="mt-5 space-y-2 sm:mt-6">
                {project.connectivity.map((c) => (
                  <li key={c} className="break-words text-muted-foreground">
                    — {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl">
                Plot inventory
              </h2>
              <div className="mt-5 -mx-1 overflow-x-auto overscroll-x-contain rounded-2xl ring-1 ring-border/70 sm:mx-0 sm:mt-6">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-muted/70">
                    <tr>
                      <th className="px-3 py-3 font-medium sm:px-4">Plot</th>
                      <th className="px-3 py-3 font-medium sm:px-4">Area</th>
                      <th className="px-3 py-3 font-medium sm:px-4">Price</th>
                      <th className="px-3 py-3 font-medium sm:px-4">Facing</th>
                      <th className="px-3 py-3 font-medium sm:px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.plots.map((plot) => (
                      <tr key={plot.id} className="border-t border-border/60">
                        <td className="px-3 py-3 sm:px-4">{plot.number}</td>
                        <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                          {plot.areaGuntha} Guntha
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                          {formatINR(plot.price)}
                        </td>
                        <td className="px-3 py-3 sm:px-4">
                          {plot.facing || "—"}
                        </td>
                        <td className="px-3 py-3 capitalize sm:px-4">
                          <span
                            className={
                              plot.status === "available"
                                ? "text-primary"
                                : plot.status === "reserved"
                                  ? "text-gold"
                                  : "text-muted-foreground"
                            }
                          >
                            {plot.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl">
                Legal documents
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
                {project.documents.map((doc) => (
                  <a
                    key={doc.title}
                    href={doc.url}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/4"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium break-words">
                        {doc.title}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {doc.type.replace("-", " ")}
                      </span>
                    </span>
                    <Download className="size-4 shrink-0 text-primary" />
                  </a>
                ))}
              </div>
              <p className="mt-3 text-sm break-words text-muted-foreground">
                Legal status: {project.legalStatus}
              </p>
            </div>
          </div>

          <aside className="order-1 min-w-0 lg:sticky lg:top-28 lg:order-2 lg:self-start">
            <div className="glass rounded-2xl p-5 sm:p-6">
              <p className="text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
                Starting from
              </p>
              <p className="font-display mt-1 text-3xl break-words text-primary sm:text-4xl">
                {formatINR(project.pricing.minPrice)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                up to {formatINR(project.pricing.maxPrice)}
              </p>
              <div className="gold-line my-5" />
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Area</dt>
                  <dd className="min-w-0 text-right break-words">
                    {project.area.minGuntha}–{project.area.maxGuntha} Guntha
                  </dd>
                </div>
                {project.pricePerSqFt != null ? (
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">₹ / sq.ft</dt>
                    <dd className="tabular-nums">{project.pricePerSqFt}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">
                    Available plots
                  </dt>
                  <dd>{available}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Status</dt>
                  <dd className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor:
                          LISTING_BADGE_META[project.listingBadge || "available"]
                            .color,
                      }}
                    />
                    {
                      LISTING_BADGE_META[project.listingBadge || "available"]
                        .label
                    }
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">
                    Booking amount
                  </dt>
                  <dd className="min-w-0 text-right break-words">
                    {project.pricing.bookingAmount
                      ? formatINR(project.pricing.bookingAmount)
                      : "On request"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Appreciation</dt>
                  <dd className="min-w-0 text-right break-words">
                    {project.appreciation}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <AssetGrowthMetrics project={project} />
              </div>

              <div className="mt-4">
                <ProjectEngagement
                  slug={project.slug}
                  initialInterest={project.interestCount || 0}
                  initialAvg={project.ratingAvg || 0}
                  initialCount={project.ratingCount || 0}
                />
              </div>
              <div className="mt-6 grid gap-2">
                <SiteVisitDialog
                  projectSlug={project.slug}
                  className="h-11 w-full gradient-emerald"
                />
                {project.waitlistEnabled ||
                project.listingBadge === "coming-soon" ||
                project.status.includes("upcoming") ? (
                  <WaitlistDialog
                    projectSlug={project.slug}
                    projectName={project.name}
                    triggerClassName="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border text-sm font-semibold tracking-[0.1em] uppercase"
                  />
                ) : null}
                <WishlistButton
                  projectSlug={project.slug}
                  variant="button"
                  className="w-full"
                />
                <Button asChild variant="outline" className="h-11">
                  <Link href={`/booking?project=${project.slug}`}>
                    Online Plot Booking
                  </Link>
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    className="w-full"
                  >
                    <a
                      href={`https://wa.me/${SITE.whatsapp}?text=Hi, interested in ${project.name}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    className="w-full"
                  >
                    <a
                      href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                      aria-label="Call"
                    >
                      <Phone className="size-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                    aria-label="Share"
                  >
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.attributes.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-primary/8 px-2.5 py-1 text-[0.65rem] tracking-wide text-primary capitalize"
                  >
                    {a.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <LandSearchSection
        className="border-t border-border/60 bg-muted/30 pb-28 lg:pb-16"
        initial={{
          state: project.location.state,
          category: project.category,
        }}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/92 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
              From
            </p>
            <p className="truncate text-base font-semibold text-primary">
              {formatINR(project.pricing.minPrice)}
            </p>
          </div>
          <SiteVisitDialog
            projectSlug={project.slug}
            triggerLabel="Book visit"
            className="h-11 shrink-0 rounded-full px-5"
          />
        </div>
      </div>
    </article>
  );
}
