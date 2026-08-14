"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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
  onEnded,
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
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMuted = Boolean(muted ?? autoPlay);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
    if (!isMuted) {
      el.volume = 1;
      void el.play().catch(() => {});
    }
  }, [isMuted, src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isVideoUrl(src)) return;
    if (autoPlay) {
      el.currentTime = 0;
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [autoPlay, src]);

  if (!src) return null;
  const fit = fitClassName(objectFit);

  if (isYoutubeUrl(src) || isVimeoUrl(src)) {
    const youtube = isYoutubeUrl(src);
    const embed = youtube ? youtubeEmbedUrl(src) : vimeoEmbedUrl(src);
    const params = new URLSearchParams();

    if (youtube) {
      params.set("autoplay", autoPlay ? "1" : "0");
      params.set("mute", isMuted ? "1" : "0");
      params.set("playsinline", "1");
      params.set("rel", "0");
      params.set("modestbranding", "1");
      params.set("iv_load_policy", "3");
      if (loop) {
        params.set("loop", "1");
        const id = embed.split("/embed/")[1]?.split("?")[0];
        if (id) params.set("playlist", id);
      }
      if (!controls) {
        params.set("controls", "0");
        params.set("disablekb", "1");
        params.set("fs", "0");
      }
    } else {
      params.set("autoplay", autoPlay ? "1" : "0");
      params.set("muted", isMuted ? "1" : "0");
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
        key={srcUrl}
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
        ref={videoRef}
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline={playsInline}
        onEnded={onEnded}
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
      className={cn("block h-auto w-full max-w-full", className)}
    />
  );
}
