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

function fitClassName(objectFit: "cover" | "contain") {
  return objectFit === "cover"
    ? "object-cover object-center"
    : "object-contain object-center";
}

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
  const fit = fitClassName(objectFit);

  if (isYoutubeUrl(src) || isVimeoUrl(src)) {
    const youtube = isYoutubeUrl(src);
    const embed = youtube ? youtubeEmbedUrl(src) : vimeoEmbedUrl(src);
    const params = new URLSearchParams();
    const shouldMute = Boolean(muted || autoPlay);

    if (youtube) {
      params.set("autoplay", autoPlay ? "1" : "0");
      params.set("mute", shouldMute ? "1" : "0");
      params.set("playsinline", "1");
      params.set("rel", "0");
      params.set("modestbranding", "1");
      params.set("iv_load_policy", "3");
      if (loop) {
        params.set("loop", "1");
        // YouTube needs playlist=VIDEO_ID for loop to work
        const id = embed.split("/embed/")[1]?.split("?")[0];
        if (id) params.set("playlist", id);
      }
      // Hide YouTube chrome for ambient/hero playback
      if (!controls) {
        params.set("controls", "0");
        params.set("disablekb", "1");
        params.set("fs", "0");
      }
    } else {
      params.set("autoplay", autoPlay ? "1" : "0");
      params.set("muted", shouldMute ? "1" : "0");
      params.set("playsinline", "1");
      if (loop) params.set("loop", "1");
      if (!controls) {
        params.set("controls", "0");
        params.set("background", "1");
      }
    }

    const srcUrl = `${embed}${embed.includes("?") ? "&" : "?"}${params.toString()}`;

    return (
      <iframe
        src={srcUrl}
        title={alt || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={controls}
        className={cn(
          fill
            ? "absolute inset-0 h-full w-full max-w-none"
            : "aspect-video h-auto w-full max-w-full",
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
          fill
            ? "absolute inset-0 h-full w-full max-w-none"
            : "h-auto w-full max-w-full",
          fit,
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
        sizes="100vw"
        className={cn(fit, className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("h-auto w-full max-w-full", fit, className)}
    />
  );
}
