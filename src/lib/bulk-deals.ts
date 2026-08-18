import type { Project } from "@/lib/types";

/** Excel / desk inventory parcels (Tradeland data.xlsx → tl-* projects). */
export function isBulkDealProject(project: {
  bulkDeal?: boolean;
  slug?: string;
}) {
  if (project.bulkDeal) return true;
  return Boolean(project.slug?.startsWith("tl-"));
}

export const BULK_SIZE_OPTIONS = [
  { label: "25–50 Acre", value: "25-50" },
  { label: "50–75 Acre", value: "50-75" },
  { label: "75–100 Acre", value: "75-100" },
  { label: "25–100 Acre", value: "25-100" },
] as const;

/** Bulk desk budget band: ₹25L – ₹5 Cr */
export const BULK_BUDGET_OPTIONS = [
  { label: "₹25L – ₹50L", value: "2500000-5000000" },
  { label: "₹50L – ₹1 Cr", value: "5000000-10000000" },
  { label: "₹1 Cr – ₹3 Cr", value: "10000000-30000000" },
  { label: "₹3 Cr – ₹5 Cr", value: "30000000-50000000" },
] as const;

export function projectAcreBounds(project: Project) {
  const minAcre =
    project.area.minAcre ??
    (project.area.minGuntha > 0 ? project.area.minGuntha / 40 : 0);
  const maxAcre =
    project.area.maxAcre ??
    (project.area.maxGuntha > 0 ? project.area.maxGuntha / 40 : 0);
  return { minAcre, maxAcre };
}
