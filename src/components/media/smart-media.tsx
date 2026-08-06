"use client";

import Image from "next/image";
import {
  isVideoUrl,
  isVimeoUrl,
  isYoutubeUrl,
  vimeoEmbedUrl,
  youtubeEmbedUrl,
} from "@/lib/media";
import { cn } from "@/lib/utils";

export function SmartMedia({
  src,
  alt = "",
  className,
  fill,
  priority,
  controls = true,
  autoPlay,
  muted,
  loop,
  playsInline = true,
  poster,
  objectFit = "cover",
}: {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  poster?: string;
  objectFit?: "cover" | "contain";
}) {
  if (!src) return null;

  if (isYoutubeUrl(src) || isVimeoUrl(src)) {
    const embed = isYoutubeUrl(src)
      ? youtubeEmbedUrl(src)
      : vimeoEmbedUrl(src);
    return (
      <iframe
        src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=${autoPlay ? 1 : 0}&mute=${muted || autoPlay ? 1 : 0}`}
        title={alt || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={cn(
          fill ? "absolute inset-0 h-full w-full" : "h-full w-full",
          className
        )}
      />
    );
  }

  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted ?? autoPlay}
        loop={loop}
        playsInline={playsInline}
        className={cn(
          fill ? "absolute inset-0 h-full w-full" : "h-full w-full",
          objectFit === "cover" ? "object-cover" : "object-contain",
          className
        )}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          objectFit === "cover" ? "object-cover" : "object-contain",
          className
        )}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        objectFit === "cover" ? "object-cover" : "object-contain",
        className
      )}
    />
  );
}
