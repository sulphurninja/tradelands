"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Search,
  X,
} from "lucide-react";
import type { ListingBadge, Project } from "@/lib/types";
import { LISTING_BADGE_META } from "@/lib/constants";
import {
  categoryLabel,
  formatINR,
  getProjectUnitRate,
} from "@/lib/format";
import { pickProjectCover } from "@/lib/project-images";
import {
  LIVE_MARKET_CORRIDORS,
  projectMatchesCorridor,
} from "@/lib/market-corridors";
import { SafeProjectImage } from "@/components/media/safe-project-image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type MapAsset = Pick<
  Project,
  | "id"
  | "slug"
  | "name"
  | "tagline"
  | "category"
  | "listingBadge"
  | "location"
  | "pricePerSqFt"
  | "coverImage"
  | "pricing"
  | "area"
  | "growthPotentialPct"
>;

export function pinColor(badge?: string) {
  const key = (badge || "available") as keyof typeof LISTING_BADGE_META;
  return LISTING_BADGE_META[key]?.color || "#22c55e";
}

export function assetCover(project: MapAsset) {
  return (
    project.coverImage ||
    pickProjectCover(project.slug || project.id, project.category)
  );
}

function placeLabel(p: MapAsset) {
  return [p.location.village || p.location.taluka, p.location.district]
    .filter(Boolean)
    .join(", ");
}

type ExploreMapInnerProps = {
  projects: MapAsset[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export function ExploreMap({ projects }: { projects: MapAsset[] }) {
  const [MapView, setMapView] = useState<null | React.ComponentType<ExploreMapInnerProps>>(
    null
  );
  const [query, setQuery] = useState("");
  const [badge, setBadge] = useState<"all" | ListingBadge>("all");
  const [corridor, setCorridor] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    void import("./explore-map-inner").then((mod) => {
      setMapView(() => mod.ExploreMapInner);
    });
  }, []);

  const withCoords = useMemo(
    () =>
      projects.filter(
        (p) =>
          typeof p.location.lat === "number" &&
          typeof p.location.lng === "number"
      ),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withCoords.filter((p) => {
      if (badge !== "all" && (p.listingBadge || "available") !== badge) {
        return false;
      }
      if (corridor !== "all" && !projectMatchesCorridor(p, corridor)) {
        return false;
      }
      if (!q) return true;
      const hay =
        `${p.name} ${p.tagline} ${p.location.village} ${p.location.taluka} ${p.location.district}`.toLowerCase();
      return hay.includes(q);
    });
  }, [withCoords, query, badge, corridor]);

  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Maharashtra land map
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {filtered.length} pinned asset
              {filtered.length === 1 ? "" : "s"}
              {withCoords.length !== filtered.length
                ? ` · ${withCoords.length} total`
                : ""}
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search village, corridor, asset…"
              className="h-10 rounded-full border-border bg-muted/40 pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={badge === "all"}
            onClick={() => setBadge("all")}
            label="All status"
          />
          {(
            Object.entries(LISTING_BADGE_META) as [
              ListingBadge,
              (typeof LISTING_BADGE_META)[ListingBadge],
            ][]
          ).map(([key, meta]) => (
            <FilterChip
              key={key}
              active={badge === key}
              onClick={() => setBadge(key)}
              label={meta.label}
              color={meta.color}
            />
          ))}
          <span className="mx-1 hidden h-4 w-px bg-border sm:inline-block" />
          <FilterChip
            active={corridor === "all"}
            onClick={() => setCorridor("all")}
            label="All locations"
          />
          {LIVE_MARKET_CORRIDORS.map((c) => (
            <FilterChip
              key={c.slug}
              active={corridor === c.slug}
              onClick={() => setCorridor(c.slug)}
              label={c.name}
            />
          ))}
          <Link
            href="/market"
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase"
          >
            Open market
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Asset list */}
        <aside className="flex max-h-[42vh] flex-col border-b border-border lg:max-h-[min(72vh,820px)] lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Assets
            </p>
            <p className="text-[11px] text-muted-foreground">{filtered.length}</p>
          </div>
          <ul className="flex-1 overflow-y-auto overscroll-contain p-2">
            {filtered.length === 0 ? (
              <li className="px-3 py-10 text-center text-sm text-muted-foreground">
                No assets match these filters.
              </li>
            ) : (
              filtered.map((p) => {
                const active = p.id === selectedId;
                const badgeMeta =
                  LISTING_BADGE_META[p.listingBadge || "available"];
                const cover = assetCover(p);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedId(active ? null : p.id)
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition",
                        active
                          ? "bg-muted ring-1 ring-foreground/15"
                          : "hover:bg-muted/60"
                      )}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <SafeProjectImage
                          src={cover}
                          alt=""
                          className="object-cover"
                          sizes="48px"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: badgeMeta.color }}
                          />
                          <span className="truncate text-sm font-semibold tracking-[-0.01em]">
                            {p.name}
                          </span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />
                          {placeLabel(p) || "Maharashtra"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        {/* Map stage */}
        <div className="relative h-[min(58vh,560px)] bg-muted lg:h-[min(72vh,820px)]">
          {MapView ? (
            <MapView
              projects={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading map…
            </div>
          )}

          {/* Selected preview — image-forward, enterprise card */}
          {selected ? (
            <SelectedAssetCard
              project={selected}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="pointer-events-none absolute bottom-4 left-4 z-[450] hidden max-w-[220px] rounded-xl border border-border/80 bg-background/90 px-3 py-2.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur-md sm:block">
              Click a photo pin or list item to preview the asset.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold tracking-[0.04em] transition",
        active
          ? "border-foreground/20 bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground"
      )}
    >
      {color ? (
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: active ? "currentColor" : color }}
        />
      ) : null}
      {label}
    </button>
  );
}

function SelectedAssetCard({
  project,
  onClose,
}: {
  project: MapAsset;
  onClose: () => void;
}) {
  const badge = LISTING_BADGE_META[project.listingBadge || "available"];
  const cover = assetCover(project);
  const unitRate = getProjectUnitRate(project);
  const place = placeLabel(project);

  return (
    <article
      className={cn(
        "absolute inset-x-3 bottom-3 z-[500] overflow-hidden rounded-2xl border border-border bg-background shadow-xl",
        "sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-[340px]"
      )}
    >
      <div className="relative aspect-[16/10] bg-muted">
        <SafeProjectImage
          src={cover}
          alt={project.name}
          className="object-cover"
          sizes="340px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
          aria-label="Close preview"
        >
          <X className="size-4" />
        </button>
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: badge.color }}
            />
            {badge.label}
          </span>
        </div>
        <div className="absolute right-3 bottom-3 left-3">
          <p className="text-[10px] font-medium tracking-[0.12em] text-white/80 uppercase">
            {categoryLabel(project.category)}
          </p>
          <h3 className="mt-0.5 text-base font-semibold tracking-[-0.02em] text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span>{place || "Maharashtra"}</span>
        </p>
        {project.tagline ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.tagline}
          </p>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-3">
          <div>
            {unitRate ? (
              <>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {unitRate.label}
                </p>
                <p className="text-sm font-semibold">{unitRate.display}</p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  From
                </p>
                <p className="text-sm font-semibold">
                  {formatINR(project.pricing.minPrice)}
                </p>
              </>
            )}
          </div>
          {project.growthPotentialPct != null ? (
            <p className="text-xs font-medium text-emerald-700">
              +{project.growthPotentialPct}% growth signal
            </p>
          ) : null}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-foreground text-sm font-semibold text-background transition hover:bg-foreground/90"
        >
          View asset
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
