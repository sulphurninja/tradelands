import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabel } from "@/lib/format";
import { LISTING_BADGE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { WishlistButton } from "@/components/projects/wishlist-button";
import { AssetGrowthMetrics } from "@/components/market/asset-growth-metrics";

export function AssetCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const badge = LISTING_BADGE_META[project.listingBadge || "available"];
  const areaLabel = project.area.maxAcre
    ? `${Math.round((project.area.minAcre || 0) * 43560).toLocaleString("en-IN")}–${Math.round(project.area.maxAcre * 43560).toLocaleString("en-IN")} SQ.FT`
    : `${project.area.minGuntha}–${project.area.maxGuntha} Guntha`;

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[280px] flex-col rounded-2xl border border-border/80 bg-card p-6 sm:min-h-[300px] sm:p-8 lg:p-9",
        className
      )}
    >
      <div className="absolute top-5 right-5 z-10 sm:top-6 sm:right-6">
        <WishlistButton projectSlug={project.slug} />
      </div>

      <div className="flex items-center gap-2 pr-12">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: badge.color }}
          title={badge.label}
        />
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {badge.label}
        </p>
      </div>

      <Link href={`/projects/${project.slug}`} className="mt-5 block min-w-0 flex-1">
        <h3 className="text-[1.35rem] leading-[1.15] font-semibold tracking-[-0.03em] break-words uppercase sm:text-[1.65rem]">
          {project.name}
        </h3>
        <p className="mt-2 text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {project.location.village || project.location.taluka} ·{" "}
          {project.location.district}
        </p>

        <div className="mt-5 space-y-1.5">
          {project.pricePerSqFt != null ? (
            <p className="text-[15px] tabular-nums text-foreground/90">
              ₹{project.pricePerSqFt} / sq.ft
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <AssetGrowthMetrics project={project} compact />
        </div>

        <p className="mt-5 text-[12px] leading-relaxed tracking-[0.04em] text-muted-foreground uppercase">
          {areaLabel}
          <span className="mx-2 opacity-40">·</span>
          {categoryLabel(project.category)}
          {project.attributes[0] ? (
            <>
              <span className="mx-2 opacity-40">·</span>
              {project.attributes[0].replace("-", " ")}
            </>
          ) : null}
        </p>
      </Link>

      <Link
        href={`/projects/${project.slug}`}
        className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.12em] uppercase text-foreground transition group-hover:gap-3"
      >
        View Asset
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}
