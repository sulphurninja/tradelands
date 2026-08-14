"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { LISTING_BADGE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MapProject = Pick<
  Project,
  "id" | "slug" | "name" | "listingBadge" | "location" | "pricePerSqFt"
>;

export function ExploreMap({ projects }: { projects: MapProject[] }) {
  const [MapView, setMapView] = useState<null | React.ComponentType<{
    projects: MapProject[];
  }>>(null);

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

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full sm:h-[calc(100vh-4rem)]">
      {MapView ? (
        <MapView projects={withCoords} />
      ) : (
        <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
          Loading Maharashtra map…
        </div>
      )}

      <div className="absolute top-4 left-4 z-[500] max-w-xs rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur">
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase">
          Explore land on map
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {withCoords.length} assets pinned across Maharashtra.
        </p>
        <ul className="mt-3 space-y-1.5 text-xs">
          {Object.entries(LISTING_BADGE_META).map(([key, meta]) => (
            <li key={key} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </li>
          ))}
        </ul>
        <Link
          href="/market"
          className="mt-3 inline-block text-xs font-semibold tracking-[0.1em] text-primary uppercase"
        >
          Open market →
        </Link>
      </div>
    </div>
  );
}

export function pinColor(badge?: string) {
  const key = (badge || "available") as keyof typeof LISTING_BADGE_META;
  return LISTING_BADGE_META[key]?.color || "#22c55e";
}

export function MapProjectList({
  projects,
  className,
}: {
  projects: MapProject[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {projects.slice(0, 8).map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.slug}`}
          className="block rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
        >
          {p.name}
        </Link>
      ))}
    </div>
  );
}
