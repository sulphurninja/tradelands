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
    "na-villa-plot": "NA Villa Plot",
    "farm-house": "Farm House",
  };
  return map[category] ?? category;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
