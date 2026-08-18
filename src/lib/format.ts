export function formatINR(amount: number) {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(guntha: number) {
  const acre = guntha / 40;
  if (acre >= 1) {
    return `${acre.toFixed(2)} Acre`;
  }
  return `${guntha} Guntha`;
}

export function categoryLabel(category: string) {
  const map: Record<string, string> = {
    "agriculture-land": "Agriculture Land",
    "na-villa-plot": "NA Land",
    "farm-house": "Farm House",
  };
  return map[category] ?? category;
}

/** Unit rate for listing cards / detail — agri = /acre, NA = /sq.ft */
export function getProjectUnitRate(project: {
  category: string;
  pricePerSqFt?: number;
  pricing: {
    pricePerAcre?: number;
    minPrice: number;
    maxPrice: number;
  };
  area: {
    maxAcre?: number;
    maxGuntha: number;
  };
}): { label: string; display: string } | null {
  const isNa = project.category === "na-villa-plot";
  const acres =
    project.area.maxAcre ||
    (project.area.maxGuntha > 0 ? project.area.maxGuntha / 40 : 0);

  if (isNa) {
    let perSqFt = project.pricePerSqFt;
    if (perSqFt == null && project.pricing.pricePerAcre) {
      perSqFt = Math.round(project.pricing.pricePerAcre / 43560);
    }
    if (perSqFt == null && acres > 0) {
      perSqFt = Math.round(project.pricing.maxPrice / (acres * 43560));
    }
    if (perSqFt == null || !Number.isFinite(perSqFt) || perSqFt <= 0) {
      return null;
    }
    return {
      label: "₹ / sq.ft",
      display: perSqFt.toLocaleString("en-IN"),
    };
  }

  let perAcre = project.pricing.pricePerAcre;
  if (perAcre == null && project.pricePerSqFt != null) {
    perAcre = Math.round(project.pricePerSqFt * 43560);
  }
  if (perAcre == null && acres > 0) {
    perAcre = Math.round(project.pricing.maxPrice / acres);
  }
  if (perAcre == null || !Number.isFinite(perAcre) || perAcre <= 0) {
    return null;
  }
  return {
    label: "₹ / acre",
    display: formatINR(perAcre),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
