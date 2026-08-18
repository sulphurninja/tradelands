"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  assetCover,
  pinColor,
  type MapAsset,
} from "@/components/map/explore-map";
import "leaflet/dist/leaflet.css";

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function photoPinIcon(project: MapAsset, selected: boolean) {
  const color = pinColor(project.listingBadge);
  const cover = escapeAttr(assetCover(project));
  const size = selected ? 58 : 44;
  const ring = selected ? 3 : 2;

  return L.divIcon({
    className: "tl-map-pin",
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 8],
    html: `
      <div class="tl-map-pin__wrap ${selected ? "is-selected" : ""}" style="--pin:${color};--size:${size}px;--ring:${ring}px">
        <div class="tl-map-pin__disc">
          <img src="${cover}" alt="" loading="lazy" decoding="async" />
        </div>
        <span class="tl-map-pin__point"></span>
      </div>
    `,
  });
}

function MapController({
  projects,
  selectedId,
  onSelect,
}: {
  projects: MapAsset[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const map = useMap();
  const idsKey = projects.map((p) => p.id).join(",");

  useMapEvents({
    click: () => onSelect(null),
  });

  useEffect(() => {
    if (!projects.length) return;
    const bounds = L.latLngBounds(
      projects.map(
        (p) => [p.location.lat!, p.location.lng!] as [number, number]
      )
    );
    map.fitBounds(bounds.pad(0.2), { animate: true, maxZoom: 11 });
  }, [idsKey, map, projects]);

  useEffect(() => {
    const p = projects.find((x) => x.id === selectedId);
    if (!p?.location.lat || !p.location.lng) return;
    map.flyTo([p.location.lat, p.location.lng], Math.max(map.getZoom(), 12), {
      duration: 0.7,
    });
  }, [selectedId, map, projects]);

  return null;
}

export function ExploreMapInner({
  projects,
  selectedId,
  onSelect,
}: {
  projects: MapAsset[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const center: [number, number] = [18.82, 73.25];

  const icons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const p of projects) {
      map.set(p.id, photoPinIcon(p, p.id === selectedId));
    }
    return map;
  }, [projects, selectedId]);

  return (
    <MapContainer
      center={center}
      zoom={8}
      className="tl-explore-map h-full w-full"
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="topright" />
      <MapController
        projects={projects}
        selectedId={selectedId}
        onSelect={onSelect}
      />
      {projects.map((p) => (
        <Marker
          key={p.id}
          position={[p.location.lat!, p.location.lng!]}
          icon={icons.get(p.id)}
          zIndexOffset={p.id === selectedId ? 1000 : 0}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e.originalEvent);
              onSelect(p.id === selectedId ? null : p.id);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
