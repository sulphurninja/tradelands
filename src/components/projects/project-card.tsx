"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabel, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "featured";
  className?: string;
}

export function ProjectCard({
  project,
  variant = "default",
  className,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-card ring-1 ring-border/70 transition-all duration-500 hover:-translate-y-1 hover:ring-primary/30",
        variant === "featured" && "lg:min-h-[420px]",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "featured" ? "aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto" : "aspect-[5/4]"
        )}
      >
        <Image
          src={project.coverImage}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/25 to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[0.65rem] tracking-[0.14em] text-white uppercase backdrop-blur-md">
            {categoryLabel(project.category)}
          </span>
          {project.status.includes("new-launch") && (
            <span className="rounded-full bg-gold/90 px-3 py-1 text-[0.65rem] tracking-[0.14em] text-on-gold uppercase">
              New Launch
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 p-5 sm:p-6",
          variant === "featured" && "lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-8"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-display text-xl break-words text-foreground transition-colors group-hover:text-primary sm:text-2xl",
                variant === "featured" && "lg:text-3xl lg:text-white"
              )}
            >
              {project.name}
            </h3>
            <p
              className={cn(
                "mt-1 flex items-start gap-1.5 text-sm text-muted-foreground sm:items-center",
                variant === "featured" && "lg:text-white/75"
              )}
            >
              <MapPin className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
              <span className="min-w-0 break-words">
                {project.location.village}, {project.location.district}
              </span>
            </p>
          </div>
          <span
            className={cn(
              "mt-1 inline-flex size-9 items-center justify-center rounded-full border border-border/80 text-foreground transition-colors group-hover:border-primary group-hover:text-primary",
              variant === "featured" && "lg:border-white/30 lg:text-white"
            )}
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <p
          className={cn(
            "mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground",
            variant === "featured" && "lg:text-white/70"
          )}
        >
          {project.tagline}
        </p>

        <div
          className={cn(
            "mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-border/60 pt-4",
            variant === "featured" && "lg:border-white/15"
          )}
        >
          <div className="min-w-0">
            <p
              className={cn(
                "text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase",
                variant === "featured" && "lg:text-white/55"
              )}
            >
              Starting
            </p>
            <p
              className={cn(
                "mt-0.5 font-medium break-words text-foreground",
                variant === "featured" && "lg:text-gold"
              )}
            >
              {formatINR(project.pricing.minPrice)}
            </p>
          </div>
          <p
            className={cn(
              "shrink-0 text-sm text-muted-foreground",
              variant === "featured" && "lg:text-white/70"
            )}
          >
            {project.area.minGuntha}–{project.area.maxGuntha} Guntha
          </p>
        </div>
      </div>
    </Link>
  );
}
