"use client";

import Image from "next/image";
import { useState } from "react";
import {
  COVER_FALLBACKS,
  DEFAULT_LAND_IMAGE,
} from "@/lib/project-images";
import { cn } from "@/lib/utils";

export function SafeProjectImage({
  src,
  alt = "",
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  priority,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const initial = src?.trim() || DEFAULT_LAND_IMAGE;
  const [index, setIndex] = useState(0);
  const candidates = [
    initial,
    ...COVER_FALLBACKS.filter((u) => u !== initial),
  ];
  const current = candidates[Math.min(index, candidates.length - 1)]!;

  return (
    <Image
      key={current}
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => {
        setIndex((i) => Math.min(i + 1, candidates.length - 1));
      }}
    />
  );
}
