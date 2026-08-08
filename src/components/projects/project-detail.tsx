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
    <article>
      <section className="relative min-h-[70vh] overflow-hidden bg-black pt-24">
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
          objectFit={project.heroVideo ? "contain" : "cover"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
        <div className="container-premium section-pad relative flex min-h-[70vh] flex-col justify-end pb-12">
          <div className="flex flex-wrap gap-2">
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
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {project.name}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-white/80">
            <MapPin className="size-4" />
            {project.location.village}, {project.location.taluka},{" "}
            {project.location.district}, {project.location.state}
          </p>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            {project.tagline}
          </p>
        </div>
      </section>

      <section className="container-premium section-pad py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-14">
            <div>
              <p className="text-[0.7rem] tracking-[0.28em] text-primary uppercase">
                Overview
              </p>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                {project.overview}
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {project.story}
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl">Investment highlights</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 rounded-xl bg-muted/70 px-4 py-3 text-sm"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {project.droneVideo ? (
              <div>
                <h2 className="font-display text-3xl">Drone tour</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aerial walkthrough of the land and surroundings.
                </p>
                <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-black">
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

            <div>
              <h2 className="font-display text-3xl">Gallery</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
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

            <div>
              <h2 className="font-display text-3xl">Amenities</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.amenities.map((a) => (
                  <span
                    key={a.name}
                    className="rounded-full border border-border px-4 py-2 text-sm"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl">Nearby connectivity</h2>
              <ul className="mt-6 space-y-2">
                {project.connectivity.map((c) => (
                  <li key={c} className="text-muted-foreground">
                    — {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl">Plot inventory</h2>
              <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-border/70">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-muted/70">
                    <tr>
                      <th className="px-4 py-3 font-medium">Plot</th>
                      <th className="px-4 py-3 font-medium">Area</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Facing</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.plots.map((plot) => (
                      <tr key={plot.id} className="border-t border-border/60">
                        <td className="px-4 py-3">{plot.number}</td>
                        <td className="px-4 py-3">{plot.areaGuntha} Guntha</td>
                        <td className="px-4 py-3">{formatINR(plot.price)}</td>
                        <td className="px-4 py-3">{plot.facing || "—"}</td>
                        <td className="px-4 py-3 capitalize">
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

            <div>
              <h2 className="font-display text-3xl">Legal documents</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.documents.map((doc) => (
                  <a
                    key={doc.title}
                    href={doc.url}
                    className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/4"
                  >
                    <span>
                      <span className="block font-medium">{doc.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {doc.type.replace("-", " ")}
                      </span>
                    </span>
                    <Download className="size-4 text-primary" />
                  </a>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Legal status: {project.legalStatus}
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-2xl p-6">
              <p className="text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
                Starting from
              </p>
              <p className="font-display mt-1 text-4xl text-primary">
                {formatINR(project.pricing.minPrice)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                up to {formatINR(project.pricing.maxPrice)}
              </p>
              <div className="gold-line my-5" />
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Area</dt>
                  <dd>
                    {project.area.minGuntha}–{project.area.maxGuntha} Guntha
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Available plots</dt>
                  <dd>{available}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Booking amount</dt>
                  <dd>
                    {project.pricing.bookingAmount
                      ? formatINR(project.pricing.bookingAmount)
                      : "On request"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Appreciation</dt>
                  <dd className="text-right">{project.appreciation}</dd>
                </div>
              </dl>
              <div className="mt-6 grid gap-2">
                <Button asChild className="h-11 gradient-emerald text-white">
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
                  <Button asChild variant="ghost" size="icon-sm" className="w-full">
                    <a
                      href={`https://wa.me/${SITE.whatsapp}?text=Hi, interested in ${project.name}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="icon-sm" className="w-full">
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
    </article>
  );
}
