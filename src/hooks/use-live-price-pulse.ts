"use client";

import { useEffect, useRef, useState } from "react";

export type LivePulse = {
  /** Multiplier around 1 (e.g. 0.96–1.05). */
  factor: number;
  /** Signed tick vs previous factor, for flash UI. */
  delta: number;
  /** Monotonic tick counter — bumps every pulse. */
  tick: number;
};

/**
 * Live desk pulse — drifts ±1–4% every 2.5–4.5s so charts feel active.
 */
export function useLivePricePulse(enabled = true): LivePulse {
  const [state, setState] = useState<LivePulse>({
    factor: 1,
    delta: 0,
    tick: 0,
  });
  const prev = useRef(1);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const tick = () => {
      if (cancelled) return;
      if (document.visibilityState === "hidden") {
        timer = window.setTimeout(tick, 4000);
        return;
      }
      setState((s) => {
        const step = (1 + Math.floor(Math.random() * 4)) / 100; // 1–4%
        const dir = Math.random() > 0.47 ? 1 : -1;
        const next = Math.min(1.05, Math.max(0.95, s.factor * (1 + dir * step)));
        const delta = next - prev.current;
        prev.current = next;
        return { factor: next, delta, tick: s.tick + 1 };
      });
      const wait = 2500 + Math.floor(Math.random() * 2000); // 2.5–4.5s
      timer = window.setTimeout(tick, wait);
    };

    timer = window.setTimeout(tick, 1800);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [enabled]);

  return state;
}

/** Apply pulse to numeric keys; tip of series moves most. */
export function pulseSeries<T extends Record<string, unknown>>(
  data: T[],
  factor: number,
  keys: (keyof T)[] = ["value" as keyof T],
  tipHeavy = true
): T[] {
  if (factor === 1 || !data.length) return data;
  return data.map((row, i) => {
    const t = i / Math.max(data.length - 1, 1);
    const weight = tipHeavy
      ? Math.pow(t, 1.65) * 1.35 // early flat, tip swings hard
      : 0.35 + t * 0.65;
    const f = 1 + (factor - 1) * weight;
    const next = { ...row };
    for (const key of keys) {
      const v = row[key];
      if (typeof v === "number") {
        (next as Record<string, unknown>)[key as string] = Math.max(
          1,
          Math.round(v * f)
        );
      }
    }
    return next;
  });
}
