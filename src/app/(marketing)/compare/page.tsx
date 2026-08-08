"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { FormSelect } from "@/components/ui/form-select";
import { categoryLabel, formatINR } from "@/lib/format";
import type { Project } from "@/lib/types";

export default function ComparePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.projects || []) as Project[];
        setProjects(list);
        setA(list[0]?.slug ?? "");
        setB(list[1]?.slug ?? list[0]?.slug ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const left = useMemo(() => projects.find((p) => p.slug === a), [a, projects]);
  const right = useMemo(() => projects.find((p) => p.slug === b), [b, projects]);
  const options = projects.map((p) => ({ value: p.slug, label: p.name }));

  const rows =
    left && right
      ? [
          [
            "Price range",
            `${formatINR(left.pricing.minPrice)} – ${formatINR(left.pricing.maxPrice)}`,
            `${formatINR(right.pricing.minPrice)} – ${formatINR(right.pricing.maxPrice)}`,
          ],
          [
            "Location",
            `${left.location.village}, ${left.location.district}`,
            `${right.location.village}, ${right.location.district}`,
          ],
          [
            "Area",
            `${left.area.minGuntha}–${left.area.maxGuntha} Guntha`,
            `${right.area.minGuntha}–${right.area.maxGuntha} Guntha`,
          ],
          [
            "Category",
            categoryLabel(left.category),
            categoryLabel(right.category),
          ],
          [
            "Attributes",
            left.attributes.join(", "),
            right.attributes.join(", "),
          ],
          ["Legal status", left.legalStatus, right.legalStatus],
          [
            "Appreciation",
            left.appreciation ?? "—",
            right.appreciation ?? "—",
          ],
          [
            "Amenities",
            String(left.amenities.length),
            String(right.amenities.length),
          ],
        ]
      : [];

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Compare projects"
        description="Price, location, area, amenities, and legal status — side by side."
        compact
      />
      <section className="container-premium section-pad pb-24">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading projects…</p>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-sm">
                <span className="text-muted-foreground">Project A</span>
                <FormSelect
                  value={a}
                  onValueChange={setA}
                  placeholder="Select project"
                  options={options}
                />
              </div>
              <div className="space-y-2 text-sm">
                <span className="text-muted-foreground">Project B</span>
                <FormSelect
                  value={b}
                  onValueChange={setB}
                  placeholder="Select project"
                  options={options}
                />
              </div>
            </div>

            {left && right && (
              <div className="-mx-1 overflow-x-auto overscroll-x-contain rounded-2xl ring-1 ring-border/70 sm:mx-0">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-muted/80">
                    <tr>
                      <th className="px-4 py-4 text-left font-medium">Metric</th>
                      <th className="px-4 py-4 text-left font-medium">
                        {left.name}
                      </th>
                      <th className="px-4 py-4 text-left font-medium">
                        {right.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([label, l, r]) => (
                      <tr key={label} className="border-t border-border/60">
                        <td className="px-4 py-3 text-muted-foreground">
                          {label}
                        </td>
                        <td className="px-4 py-3 capitalize">{l}</td>
                        <td className="px-4 py-3 capitalize">{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
