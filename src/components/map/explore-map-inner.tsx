"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { pinColor } from "@/components/map/explore-map";
import "leaflet/dist/leaflet.css";

type MapProject = Pick<
  Project,
  "id" | "slug" | "name" | "listingBadge" | "location" | "pricePerSqFt"
>;

export function ExploreMapInner({ projects }: { projects: MapProject[] }) {
  const center: [number, number] = [18.75, 73.2];

  return (
    <MapContainer
      center={center}
      zoom={8}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {projects.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.location.lat!, p.location.lng!]}
          radius={9}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: pinColor(p.listingBadge),
            fillOpacity: 0.95,
          }}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.location.district}
                {p.pricePerSqFt != null ? ` · ₹${p.pricePerSqFt}/sq.ft` : ""}
              </p>
              <Link
                href={`/projects/${p.slug}`}
                className="mt-2 inline-block text-xs font-semibold text-primary uppercase"
              >
                View asset →
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
