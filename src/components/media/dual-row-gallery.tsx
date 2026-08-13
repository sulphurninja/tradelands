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
  const sectionRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const mid = Math.ceil(items.length / 2) || 1;
  const top = items.slice(0, mid);
  const bottom = items.slice(mid);
  const topLoop = [...top, ...top];
  const bottomLoop = bottom.length
    ? [...bottom, ...bottom]
    : [...top, ...top];

  useEffect(() => {
    const section = sectionRef.current;
    const topEl = topRef.current;
    const bottomEl = bottomRef.current;
    if (!section || !topEl || !bottomEl) return;

    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section!.getBoundingClientRect();
        const view = window.innerHeight || 1;
        const progress = 1 - Math.min(1, Math.max(0, rect.top / view));
        const x = progress * 180;
        topEl!.style.transform = `translate3d(${-x}px,0,0)`;
        bottomEl!.style.transform = `translate3d(${x - 120}px,0,0)`;
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div ref={sectionRef} className="space-y-4 overflow-hidden py-2">
      <div className="overflow-hidden">
        <div
          ref={topRef}
          className="flex w-max gap-3 will-change-transform"
          style={{ transition: "transform 80ms linear" }}
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
          style={{ transition: "transform 80ms linear" }}
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
