export const META_PIXEL_ID = "2535211950273653";

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}

/** Fire Meta Pixel events for Ads Manager counts. */
export function trackMeta(
  event: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", event, params);
  } catch {
    // ignore tracker errors
  }
}

export function trackMetaCustom(
  event: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", event, params);
  } catch {
    // ignore
  }
}
