"use client";

import { useEffect, useRef } from "react";
import { SmartMedia } from "@/components/media/smart-media";
import { isVideoUrl } from "@/lib/media";

export type GalleryItem = {
  id: string;
  title: string;
  url: string;
  alt?: string;
  type?: string;
};

export function DualRowGallery({ items }: { items: GalleryItem[] }) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const mid = Math.ceil(items.length / 2) || 1;
  const top = items.slice(0, mid);
  const bottom = items.slice(mid);
  const topLoop = [...top, ...top, ...top];
  const bottomLoop = bottom.length
    ? [...bottom, ...bottom, ...bottom]
    : [...top, ...top, ...top];

  useEffect(() => {
    const topEl = topRef.current;
    const bottomEl = bottomRef.current;
    if (!topEl || !bottomEl) return;

    let offset = 0;
    let raf = 0;
    let last = performance.now();
    const speed = 28; // px per second

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      offset += speed * dt;

      const topWidth = topEl!.scrollWidth / 3;
      const bottomWidth = bottomEl!.scrollWidth / 3;
      const topX = -(offset % Math.max(topWidth, 1));
      const bottomX = (offset % Math.max(bottomWidth, 1)) - bottomWidth * 0.35;

      topEl!.style.transform = `translate3d(${topX}px,0,0)`;
      bottomEl!.style.transform = `translate3d(${bottomX}px,0,0)`;
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="space-y-4 overflow-hidden py-2">
      <div className="overflow-hidden">
        <div
          ref={topRef}
          className="flex w-max gap-3 will-change-transform"
        >
          {topLoop.map((item, i) => (
            <GalleryTile key={`t-${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          ref={bottomRef}
          className="flex w-max gap-3 will-change-transform"
        >
          {bottomLoop.map((item, i) => (
            <GalleryTile key={`b-${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryTile({ item }: { item: GalleryItem }) {
  const playable =
    item.type === "video" ||
    item.type === "drone" ||
    isVideoUrl(item.url);

  return (
    <figure className="w-[min(78vw,320px)] shrink-0 sm:w-[280px] lg:w-[320px]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <SmartMedia
          src={item.url}
          alt={item.alt || item.title}
          fill
          controls={playable}
          playsInline
          objectFit="cover"
        />
      </div>
      <figcaption className="mt-2 truncate text-sm text-muted-foreground">
        {item.title}
      </figcaption>
    </figure>
  );
}
