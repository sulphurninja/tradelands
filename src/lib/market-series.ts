/** Deterministic, realistic-looking land price paths for indicative charts. */

export type PricePoint = { label: string; value: number };
export type Candle = {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * GBM-ish path with mild mean reversion toward a geometric target,
 * then rescaled so the last print matches `end`.
 */
export function generatePricePath(opts: {
  seed: string;
  end: number;
  changePct: number;
  points: number;
  /** Typical step shock size (0.02–0.05 looks land-like). */
  volatility?: number;
}): PricePoint[] {
  const n = Math.max(opts.points, 2);
  const end = Math.max(opts.end, 1);
  const change = opts.changePct / 100;
  const start = Math.max(end / (1 + Math.max(change, -0.85)), 1);
  const rand = mulberry32(hashSeed(opts.seed));
  const vol = opts.volatility ?? 0.032;
  const drift = Math.pow(end / start, 1 / (n - 1)) - 1;

  let price = start;
  const raw: number[] = [price];

  for (let i = 1; i < n; i++) {
    const target = start * Math.pow(1 + drift, i);
    // Slight bullish skew when change is positive; more red days when flat/down.
    const skew = change >= 0 ? 0.48 : 0.52;
    const shock = (rand() - skew) * vol * 2.6;
    // Occasional deeper pullback / spike
    const event = rand() < 0.11 ? (rand() - 0.5) * vol * 4.2 : 0;
    const pull = ((target - price) / Math.max(price, 1)) * 0.42;
    price = Math.max(
      price * (1 + drift * 0.35 + shock + pull + event),
      start * 0.62
    );
    raw.push(price);
  }

  const scale = end / raw[raw.length - 1];
  return raw.map((v, i) => ({
    label: String(i),
    value: Math.max(1, Math.round(v * scale)),
  }));
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Expand sparse yearly admin points into a dense monthly path that still hits anchors. */
export function densifyYearSeries(
  series: { year: number; pricePerSqFt: number }[],
  seed: string,
  monthsPerSegment = 12
): PricePoint[] {
  if (!series.length) return [];
  const sorted = [...series].sort((a, b) => a.year - b.year);
  if (sorted.length === 1) {
    return generatePricePath({
      seed,
      end: sorted[0].pricePerSqFt,
      changePct: 14,
      points: 36,
    });
  }

  const out: PricePoint[] = [];
  for (let s = 0; s < sorted.length - 1; s++) {
    const from = sorted[s];
    const to = sorted[s + 1];
    const segChange =
      ((to.pricePerSqFt - from.pricePerSqFt) / Math.max(from.pricePerSqFt, 1)) *
      100;
    const path = generatePricePath({
      seed: `${seed}-${from.year}-${to.year}`,
      end: to.pricePerSqFt,
      changePct: segChange,
      points: monthsPerSegment + 1,
      volatility: 0.028 + (Math.abs(segChange) / 100) * 0.04,
    });
    // Force start of segment onto prior close / year open
    path[0] = { label: path[0].label, value: from.pricePerSqFt };
    path[path.length - 1] = {
      label: path[path.length - 1].label,
      value: to.pricePerSqFt,
    };

    const startIdx = s === 0 ? 0 : 1;
    for (let i = startIdx; i < path.length; i++) {
      out.push({ label: "", value: path[i].value });
    }
  }

  const firstYear = sorted[0].year;
  return out.map((p, i) => {
    const y = firstYear + Math.floor(i / 12);
    const m = MONTHS[i % 12];
    return { label: `${m} '${String(y).slice(-2)}`, value: p.value };
  });
}

export function pathFromMarketInputs(opts: {
  seed: string;
  end: number;
  changePct: number;
  points?: number;
}): PricePoint[] {
  return generatePricePath({
    seed: opts.seed,
    end: opts.end,
    changePct: opts.changePct,
    points: opts.points ?? 36,
    volatility: 0.03 + Math.min(Math.abs(opts.changePct) / 100, 0.25) * 0.05,
  }).map((p, i) => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() - (opts.points ?? 36) + 1 + i, 1);
    return {
      label: `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`,
      value: p.value,
    };
  });
}

/** Turn a close series into OHLC candles (one candle per point after the first). */
export function closesToCandles(path: PricePoint[], seed: string): Candle[] {
  if (path.length < 2) return [];
  const rand = mulberry32(hashSeed(`${seed}-ohlc`));
  const candles: Candle[] = [];

  for (let i = 1; i < path.length; i++) {
    const open = path[i - 1].value;
    const close = path[i].value;
    const mid = (open + close) / 2;
    const range = Math.max(Math.abs(close - open), mid * 0.008);
    const upperWick = range * (0.35 + rand() * 1.1) + mid * rand() * 0.012;
    const lowerWick = range * (0.35 + rand() * 1.1) + mid * rand() * 0.012;
    const high = Math.round(Math.max(open, close) + upperWick);
    const low = Math.round(Math.max(1, Math.min(open, close) - lowerWick));
    candles.push({
      label: path[i].label,
      open: Math.round(open),
      high,
      low,
      close: Math.round(close),
    });
  }
  return candles;
}

/** Prefer densified location series; otherwise synthesize from end + change. */
export function buildIndicativePath(opts: {
  seed: string;
  end: number;
  changePct: number;
  series?: { year: number; pricePerSqFt: number }[] | null;
  points?: number;
}): PricePoint[] {
  if (opts.series && opts.series.length >= 2) {
    const dense = densifyYearSeries(opts.series, opts.seed, 12);
    // Keep last N points for chart readability
    const keep = opts.points ?? 36;
    return dense.length > keep ? dense.slice(-keep) : dense;
  }
  return pathFromMarketInputs({
    seed: opts.seed,
    end: opts.end,
    changePct: opts.changePct,
    points: opts.points ?? 36,
  });
}

/**
 * Net-up band walk (min → max) with real chop: pullbacks, flat stretches,
 * and mixed green/red candles — not a static staircase.
 */
export function generateUpwardBandPath(opts: {
  seed: string;
  min: number;
  max: number;
  points: number;
}): PricePoint[] {
  const n = Math.max(opts.points, 8);
  const lo = Math.max(opts.min, 1);
  const hi = Math.max(opts.max, lo * 1.08);
  const rand = mulberry32(hashSeed(`upband-${opts.seed}`));

  const logLo = Math.log(lo);
  const logHi = Math.log(hi);
  const total = logHi - logLo;

  // Personality
  const vol = 0.045 + rand() * 0.04;
  const dipAt = 0.22 + rand() * 0.38;
  const dipLen = 0.12 + rand() * 0.2;
  const flatAt = rand() > 0.4 ? 0.1 + rand() * 0.65 : -1;
  const flatLen = 0.08 + rand() * 0.12;

  const prices: number[] = new Array(n);
  prices[0] = lo;
  let logP = logLo;

  for (let i = 1; i < n - 1; i++) {
    const t = i / (n - 1);
    const stepsLeft = n - 1 - i;
    const needed = (logHi - logP) / Math.max(stepsLeft, 1);

    let ret = needed * (0.55 + rand() * 0.7) + (rand() - 0.52) * vol;

    // Pullback window — consecutive down / weak bars
    if (t >= dipAt && t <= dipAt + dipLen) {
      const u = (t - dipAt) / Math.max(dipLen, 0.01);
      const strength = Math.sin(u * Math.PI);
      ret = -Math.abs(needed) * (0.6 + rand() * 1.4) * strength - rand() * vol * 0.8;
    }

    // Consolidation — near-flat noise
    if (flatAt >= 0 && t >= flatAt && t <= flatAt + flatLen) {
      ret = (rand() - 0.5) * vol * 0.55;
    }

    // Random 1–2 bar red shocks outside regimes (~18% chance)
    if (rand() < 0.18 && !(t >= dipAt && t <= dipAt + dipLen)) {
      ret = -Math.abs(needed) * (0.4 + rand() * 1.1) - rand() * vol * 0.5;
    }

    logP += ret;

    // Keep room to finish at hi; don't collapse below band floor
    const maxEarly = logHi - total * 0.06 * (stepsLeft / (n - 1));
    logP = Math.min(logP, maxEarly);
    logP = Math.max(logP, logLo + total * t * 0.25);
    logP = Math.max(logP, Math.log(lo * 0.94));

    prices[i] = Math.exp(logP);
  }
  prices[n - 1] = hi;

  // Light bar jitter (preserve ends)
  for (let i = 1; i < n - 1; i++) {
    const j = (rand() - 0.5) * prices[i]! * (0.01 + rand() * 0.02);
    prices[i] = Math.min(hi * 1.03, Math.max(lo * 0.94, prices[i]! + j));
  }

  const now = new Date();
  return prices.map((value, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1) + i, 1);
    return {
      label: `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`,
      value: Math.round(value),
    };
  });
}

/** OHLC candles for corridor / index boards — net up, organic path. */
export function generateUpwardBandCandles(
  seed: string,
  min: number,
  max: number,
  points = 30
): Candle[] {
  const path = generateUpwardBandPath({
    seed,
    min,
    max,
    points: points + 1,
  });
  return closesToCandles(path, seed);
}
