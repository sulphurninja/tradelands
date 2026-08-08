"use client";

import Link from "next/link";
import {
  Check,
  Download,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabel, formatINR } from "@/lib/format";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartMedia } from "@/components/media/smart-media";

export function ProjectDetail({ project }: { project: Project }) {
  const available = project.plots.filter((p) => p.status === "available").length;
  const heroSrc = project.heroVideo || project.coverImage;

  return (
    <article className="overflow-x-clip pb-24 lg:pb-0">
      <section className="relative overflow-hidden bg-black pt-20 sm:pt-24">
        {/* Media stage — always contain so nothing is clipped */}
        <div className="relative aspect-video w-full overflow-hidden bg-black sm:aspect-auto sm:min-h-[62svh] lg:min-h-[70vh]">
          <SmartMedia
            src={heroSrc}
            alt={project.name}
            fill
            priority
            autoPlay={Boolean(project.heroVideo)}
            muted
            loop
            controls={false}
            playsInline
            poster={project.coverImage}
            objectFit="contain"
          />
        </div>

        {/* Mobile: titles below media. Desktop: soft bottom overlay */}
        <div className="relative z-10 bg-black px-5 pt-4 pb-6 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-gradient-to-t sm:from-black sm:via-black/80 sm:to-transparent sm:pt-28 sm:pb-10">
          <div className="mx-auto w-full max-w-[980px] sm:px-8 lg:max-w-[1060px] lg:px-12 xl:max-w-[1120px] xl:px-16">
            <div className="flex max-w-full flex-wrap gap-1.5 sm:gap-2">
              <Badge className="bg-white/15 text-white backdrop-blur-md">
                {categoryLabel(project.category)}
              </Badge>
              {project.status.map((s) => (
                <Badge
                  key={s}
                  className="bg-primary text-primary-foreground capitalize"
                >
                  {s.replace("-", " ")}
                </Badge>
              ))}
            </div>
            <h1 className="mt-2.5 max-w-4xl text-[1.45rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance break-words text-white sm:mt-4 sm:text-5xl lg:text-6xl xl:text-7xl">
              {project.name}
            </h1>
            <p className="mt-2 flex items-start gap-2 text-[13px] text-white/80 sm:mt-3 sm:items-center sm:text-base">
              <MapPin className="mt-0.5 size-3.5 shrink-0 sm:mt-0 sm:size-4" />
              <span className="min-w-0 break-words">
                {project.location.village}, {project.location.taluka},{" "}
                {project.location.district}, {project.location.state}
              </span>
            </p>
            <p className="mt-2 max-w-2xl text-[13px] break-words text-white/75 sm:mt-4 sm:text-lg">
              {project.tagline}
            </p>
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
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">
                    Available plots
                  </dt>
                  <dd>{available}</dd>
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
              <div className="mt-6 grid gap-2">
                <Button asChild className="h-11 gradient-emerald text-white dark:text-white">
                  <Link href={`/book-site-visit?project=${project.slug}`}>
                    Book Site Visit
                  </Link>
                </Button>
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
          <Button asChild className="h-11 shrink-0 rounded-full px-5">
            <Link href={`/book-site-visit?project=${project.slug}`}>
              Book visit
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
