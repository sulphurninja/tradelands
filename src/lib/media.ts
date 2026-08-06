export function isVideoUrl(url?: string | null) {
  if (!url) return false;
  const u = url.toLowerCase();
  return (
    /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(u) ||
    u.includes("/video/upload/") ||
    u.includes("youtube.com") ||
    u.includes("youtu.be") ||
    u.includes("vimeo.com")
  );
}

export function isYoutubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

export function isVimeoUrl(url: string) {
  return /vimeo\.com/i.test(url);
}

export function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
  } catch {
    /* ignore */
  }
  return url;
}

export function vimeoEmbedUrl(url: string) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (match?.[1]) return `https://player.vimeo.com/video/${match[1]}`;
  return url;
}
