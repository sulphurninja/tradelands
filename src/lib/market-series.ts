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
    const skew = change >= 0 ? 0.46 : 0.52;
    const shock = (rand() - skew) * vol * 2.4;
    // Occasional deeper pullback / spike
    const event = rand() < 0.08 ? (rand() - 0.45) * vol * 3.5 : 0;
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
