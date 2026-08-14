import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabel, formatINR } from "@/lib/format";
import { LISTING_BADGE_META } from "@/lib/constants";
import { pickProjectCover } from "@/lib/project-images";
import { cn } from "@/lib/utils";
import { WishlistButton } from "@/components/projects/wishlist-button";
import { SafeProjectImage } from "@/components/media/safe-project-image";

function areaLabel(project: Project) {
  if (project.area.maxAcre) {
    const min = project.area.minAcre || project.area.maxAcre;
    if (min === project.area.maxAcre) {
      return `${project.area.maxAcre} Ac`;
    }
    return `${min}–${project.area.maxAcre} Ac`;
  }
  return `${project.area.minGuntha}–${project.area.maxGuntha} Guntha`;
}

export function AssetCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const badge = LISTING_BADGE_META[project.listingBadge || "available"];
  const cover =
    project.coverImage ||
    pickProjectCover(project.slug || project.id, project.category);
  const place = [
    project.location.village || project.location.taluka,
    project.location.district,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:border-border hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
      >
        <SafeProjectImage
          src={cover}
          alt={project.name}
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: badge.color }}
            />
            {badge.label}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton
            projectSlug={project.slug}
            className="size-9 rounded-full border border-white/25 bg-black/45 text-white shadow-sm backdrop-blur-md hover:bg-black/60 hover:text-white"
          />
        </div>

        <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
          <p className="truncate text-[11px] font-medium tracking-[0.08em] text-white/85 uppercase">
            {categoryLabel(project.category)}
          </p>
          {project.growthPotentialPct != null ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">
              +{project.growthPotentialPct.toFixed(1)}%
              <ArrowUpRight className="size-3" />
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/projects/${project.slug}`} className="min-w-0 flex-1">
          <h3 className="text-[1.05rem] leading-snug font-semibold tracking-[-0.02em] text-balance transition group-hover:text-foreground sm:text-[1.125rem]">
            {project.name}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 opacity-70" />
            <span className="truncate">{place}</span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/70 pt-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Rate
              </p>
              <p className="mt-1 text-[15px] font-semibold tabular-nums">
                {project.pricePerSqFt != null
                  ? `₹${project.pricePerSqFt}`
                  : formatINR(project.pricing.minPrice)}
                {project.pricePerSqFt != null ? (
                  <span className="ml-1 text-[11px] font-medium text-muted-foreground">
                    /sq.ft
                  </span>
                ) : null}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Size
              </p>
              <p className="mt-1 text-[15px] font-semibold tabular-nums">
                {areaLabel(project)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {project.demandLevel ? (
              <span className="tracking-[0.06em] uppercase">
                Demand · {project.demandLevel}
              </span>
            ) : null}
            {project.investmentHorizon ? (
              <span>{project.investmentHorizon}</span>
            ) : null}
            {project.attributes[0] ? (
              <span className="capitalize">
                {project.attributes[0].replace(/-/g, " ")}
              </span>
            ) : null}
          </div>
        </Link>

        <Link
          href={`/projects/${project.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1em] text-foreground uppercase transition group-hover:gap-2.5"
        >
          View asset
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
