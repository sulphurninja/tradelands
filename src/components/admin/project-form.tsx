"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Project, ProjectPlot, ProjectDocument } from "@/lib/types";
import { slugify } from "@/lib/format";
import { CATEGORIES, LOCATION_ATTRIBUTES, INVESTMENT_PURPOSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/admin/file-upload";
import { StringListEditor } from "@/components/admin/string-list-editor";
import { FormSelect } from "@/components/ui/form-select";

const statusOptions = [
  "featured",
  "trending",
  "new-launch",
  "upcoming",
  "sold-out",
] as const;

const emptyProject = (): Omit<Project, "id" | "createdAt"> => ({
  slug: "",
  name: "",
  tagline: "",
  category: "agriculture-land",
  status: ["featured"],
  location: {
    state: "Maharashtra",
    district: "",
    taluka: "",
    village: "",
  },
  pricing: {
    currency: "INR",
    minPrice: 0,
    maxPrice: 0,
    bookingAmount: 0,
  },
  area: { minGuntha: 0, maxGuntha: 0 },
  attributes: [],
  purposes: [],
  coverImage: "",
  gallery: [],
  overview: "",
  story: "",
  amenities: [],
  highlights: [],
  connectivity: [],
  documents: [],
  plots: [],
  legalStatus: "",
  featured: true,
  bulkDeal: false,
  developmentStage: "under-development",
  viewCount: 0,
  interestCount: 0,
  ratingAvg: 0,
  ratingCount: 0,
  listingBadge: "available",
  pricePerSqFt: undefined,
  growthPotentialPct: undefined,
  investmentHorizon: "",
  growth3yPct: undefined,
  growth5yPct: undefined,
  demandLevel: undefined,
  earlyAccess: false,
  waitlistEnabled: false,
});

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() =>
    project
      ? { ...project }
      : { ...emptyProject(), id: "", createdAt: new Date().toISOString() }
  );

  function patch<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      amenities: form.amenities.filter((a) => a.name.trim()),
      highlights: form.highlights.filter(Boolean),
      connectivity: form.connectivity.filter(Boolean),
      gallery: form.gallery.filter(Boolean),
    };

    try {
      const res = await fetch(
        project ? `/api/admin/projects/${project.id}` : "/api/admin/projects",
        {
          method: project ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(project ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="grid gap-4 rounded-2xl border border-border p-5 md:grid-cols-2">
        <h2 className="font-display text-xl md:col-span-2">Basics</h2>
        <div className="space-y-2 md:col-span-2">
          <Label>Name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => {
              patch("name", e.target.value);
              if (!project) patch("slug", slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            required
            value={form.slug}
            onChange={(e) => patch("slug", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <FormSelect
            value={form.category}
            onValueChange={(v) =>
              patch("category", v as Project["category"])
            }
            options={CATEGORIES.map((c) => ({
              value: c.value,
              label: c.label,
            }))}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Tagline</Label>
          <Input
            value={form.tagline}
            onChange={(e) => patch("tagline", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Overview</Label>
          <Textarea
            rows={3}
            value={form.overview}
            onChange={(e) => patch("overview", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Story</Label>
          <Textarea
            rows={3}
            value={form.story}
            onChange={(e) => patch("story", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Legal status</Label>
          <Input
            value={form.legalStatus}
            onChange={(e) => patch("legalStatus", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Appreciation note</Label>
          <Input
            value={form.appreciation || ""}
            onChange={(e) => patch("appreciation", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <Checkbox
            checked={Boolean(form.featured)}
            onCheckedChange={(v) => patch("featured", Boolean(v))}
          />
          Featured on home
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <Checkbox
            checked={Boolean(form.bulkDeal)}
            onCheckedChange={(v) => patch("bulkDeal", Boolean(v))}
          />
          Bulk deal inventory
        </label>
        <div className="space-y-2 md:col-span-2">
          <Label>Development stage</Label>
          <FormSelect
            value={form.developmentStage || "under-development"}
            onValueChange={(v) =>
              patch(
                "developmentStage",
                v as Project["developmentStage"]
              )
            }
            options={[
              { value: "developed", label: "Developed" },
              {
                value: "under-development",
                label: "Under development",
              },
            ]}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Listing badge (map / legend)</Label>
          <FormSelect
            value={form.listingBadge || "available"}
            onValueChange={(v) =>
              patch("listingBadge", v as Project["listingBadge"])
            }
            options={[
              { value: "available", label: "Available (green)" },
              { value: "coming-soon", label: "Coming Soon (yellow)" },
              { value: "premium", label: "Premium (blue)" },
              { value: "high-demand", label: "High Demand (red)" },
            ]}
          />
        </div>
        <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>₹ / sq.ft</Label>
            <Input
              type="number"
              value={form.pricePerSqFt ?? ""}
              onChange={(e) =>
                patch(
                  "pricePerSqFt",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Growth potential %</Label>
            <Input
              type="number"
              step="0.1"
              value={form.growthPotentialPct ?? ""}
              onChange={(e) =>
                patch(
                  "growthPotentialPct",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Investment horizon</Label>
            <Input
              value={form.investmentHorizon || ""}
              onChange={(e) => patch("investmentHorizon", e.target.value)}
              placeholder="3-5 years"
            />
          </div>
          <div className="space-y-2">
            <Label>Demand level</Label>
            <FormSelect
              value={form.demandLevel || "medium"}
              onValueChange={(v) =>
                patch("demandLevel", v as Project["demandLevel"])
              }
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label>Indicative 3Y growth %</Label>
            <Input
              type="number"
              step="0.1"
              value={form.growth3yPct ?? ""}
              onChange={(e) =>
                patch(
                  "growth3yPct",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Indicative 5Y growth %</Label>
            <Input
              type="number"
              step="0.1"
              value={form.growth5yPct ?? ""}
              onChange={(e) =>
                patch(
                  "growth5yPct",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <Checkbox
            checked={Boolean(form.earlyAccess)}
            onCheckedChange={(v) => patch("earlyAccess", Boolean(v))}
          />
          Early access
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <Checkbox
            checked={Boolean(form.waitlistEnabled)}
            onCheckedChange={(v) => patch("waitlistEnabled", Boolean(v))}
          />
          Enable waitlist (Coming Soon)
        </label>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border p-5 md:grid-cols-2">
        <h2 className="font-display text-xl md:col-span-2">Location</h2>
        {(["state", "district", "taluka", "village"] as const).map((key) => (
          <div key={key} className="space-y-2">
            <Label className="capitalize">{key}</Label>
            <Input
              value={form.location[key] || ""}
              onChange={(e) =>
                patch("location", { ...form.location, [key]: e.target.value })
              }
            />
          </div>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-border p-5 md:grid-cols-3">
        <h2 className="font-display text-xl md:col-span-3">Pricing & area</h2>
        <div className="space-y-2">
          <Label>Min price (₹)</Label>
          <Input
            type="number"
            value={form.pricing.minPrice}
            onChange={(e) =>
              patch("pricing", {
                ...form.pricing,
                minPrice: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Max price (₹)</Label>
          <Input
            type="number"
            value={form.pricing.maxPrice}
            onChange={(e) =>
              patch("pricing", {
                ...form.pricing,
                maxPrice: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Booking amount (₹)</Label>
          <Input
            type="number"
            value={form.pricing.bookingAmount || 0}
            onChange={(e) =>
              patch("pricing", {
                ...form.pricing,
                bookingAmount: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Min guntha</Label>
          <Input
            type="number"
            value={form.area.minGuntha}
            onChange={(e) =>
              patch("area", {
                ...form.area,
                minGuntha: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Max guntha</Label>
          <Input
            type="number"
            value={form.area.maxGuntha}
            onChange={(e) =>
              patch("area", {
                ...form.area,
                maxGuntha: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Price / guntha</Label>
          <Input
            type="number"
            value={form.pricing.pricePerGuntha || 0}
            onChange={(e) =>
              patch("pricing", {
                ...form.pricing,
                pricePerGuntha: Number(e.target.value),
              })
            }
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border p-5">
        <h2 className="font-display text-xl">Status tags</h2>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={form.status.includes(s)}
                onCheckedChange={(checked) => {
                  patch(
                    "status",
                    checked
                      ? [...form.status, s]
                      : form.status.filter((x) => x !== s)
                  );
                }}
              />
              {s.replace("-", " ")}
            </label>
          ))}
        </div>
        <h3 className="pt-2 text-sm font-medium">Location attributes</h3>
        <div className="flex flex-wrap gap-3">
          {LOCATION_ATTRIBUTES.map((a) => (
            <label key={a.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.attributes.includes(a.value)}
                onCheckedChange={(checked) => {
                  patch(
                    "attributes",
                    checked
                      ? [...form.attributes, a.value]
                      : form.attributes.filter((x) => x !== a.value)
                  );
                }}
              />
              {a.label}
            </label>
          ))}
        </div>
        <h3 className="pt-2 text-sm font-medium">Investment purposes</h3>
        <div className="flex flex-wrap gap-3">
          {INVESTMENT_PURPOSES.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.purposes.includes(p.value)}
                onCheckedChange={(checked) => {
                  patch(
                    "purposes",
                    checked
                      ? [...form.purposes, p.value]
                      : form.purposes.filter((x) => x !== p.value)
                  );
                }}
              />
              {p.label}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border p-5">
        <h2 className="font-display text-xl">Media</h2>
        <div>
          <Label>Cover image</Label>
          <FileUpload
            value={form.coverImage}
            onChange={(url) => patch("coverImage", url)}
            folder="tradelands/projects"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Hero video</Label>
            <p className="text-xs text-muted-foreground">
              Plays on the project page hero and can power the home hero when
              this project is featured.
            </p>
            <FileUpload
              value={form.heroVideo || ""}
              onChange={(url) => patch("heroVideo", url)}
              folder="tradelands/projects/hero"
              accept="video/*"
              label="Upload hero video"
            />
          </div>
          <div className="space-y-2">
            <Label>Drone video</Label>
            <p className="text-xs text-muted-foreground">
              Shown in a “Drone tour” section on the project detail page.
            </p>
            <FileUpload
              value={form.droneVideo || ""}
              onChange={(url) => patch("droneVideo", url)}
              folder="tradelands/projects/drone"
              accept="video/*"
              label="Upload drone video"
            />
          </div>
        </div>
        <div>
          <Label>Gallery images</Label>
          <StringListEditor
            values={form.gallery}
            onChange={(gallery) => patch("gallery", gallery)}
            placeholder="Image URL"
          />
          <div className="mt-3">
            <FileUpload
              label="Upload gallery image"
              folder="tradelands/projects/gallery"
              onChange={(url) => patch("gallery", [...form.gallery, url])}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-border p-5 md:grid-cols-2">
        <div>
          <h2 className="font-display mb-3 text-xl">Highlights</h2>
          <StringListEditor
            values={form.highlights}
            onChange={(highlights) => patch("highlights", highlights)}
          />
        </div>
        <div>
          <h2 className="font-display mb-3 text-xl">Connectivity</h2>
          <StringListEditor
            values={form.connectivity}
            onChange={(connectivity) => patch("connectivity", connectivity)}
          />
        </div>
        <div className="md:col-span-2">
          <h2 className="font-display mb-3 text-xl">Amenities</h2>
          <StringListEditor
            values={form.amenities.map((a) => a.name)}
            onChange={(names) =>
              patch(
                "amenities",
                names.map((name) => ({ name }))
              )
            }
            placeholder="Amenity name"
          />
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Documents</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              patch("documents", [
                ...form.documents,
                { title: "", type: "other", url: "" },
              ])
            }
          >
            Add document
          </Button>
        </div>
        {form.documents.map((doc, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border border-border/70 p-3 md:grid-cols-3"
          >
            <Input
              placeholder="Title"
              value={doc.title}
              onChange={(e) => {
                const documents = [...form.documents] as ProjectDocument[];
                documents[index] = { ...doc, title: e.target.value };
                patch("documents", documents);
              }}
            />
            <FormSelect
              value={doc.type}
              onValueChange={(type) => {
                const documents = [...form.documents] as ProjectDocument[];
                documents[index] = {
                  ...doc,
                  type: type as ProjectDocument["type"],
                };
                patch("documents", documents);
              }}
              options={[
                "7/12",
                "title-report",
                "mutation",
                "survey-map",
                "approval",
                "brochure",
                "price-sheet",
                "layout",
                "other",
              ].map((t) => ({ value: t, label: t }))}
            />
            <div className="space-y-2">
              <Input
                placeholder="Document URL"
                value={doc.url}
                onChange={(e) => {
                  const documents = [...form.documents] as ProjectDocument[];
                  documents[index] = { ...doc, url: e.target.value };
                  patch("documents", documents);
                }}
              />
              <FileUpload
                label="Upload doc"
                accept="application/pdf,image/*"
                folder="tradelands/documents"
                onChange={(url) => {
                  const documents = [...form.documents] as ProjectDocument[];
                  documents[index] = { ...doc, url };
                  patch("documents", documents);
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Plots / inventory</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              patch("plots", [
                ...form.plots,
                {
                  id: `plot-${Date.now()}`,
                  number: "",
                  areaGuntha: 0,
                  price: 0,
                  status: "available",
                },
              ])
            }
          >
            Add plot
          </Button>
        </div>
        {form.plots.map((plot, index) => (
          <div
            key={plot.id || index}
            className="grid gap-2 rounded-xl border border-border/70 p-3 md:grid-cols-5"
          >
            <Input
              placeholder="Plot no."
              value={plot.number}
              onChange={(e) => {
                const plots = [...form.plots] as ProjectPlot[];
                plots[index] = { ...plot, number: e.target.value };
                patch("plots", plots);
              }}
            />
            <Input
              type="number"
              placeholder="Guntha"
              value={plot.areaGuntha}
              onChange={(e) => {
                const plots = [...form.plots] as ProjectPlot[];
                plots[index] = {
                  ...plot,
                  areaGuntha: Number(e.target.value),
                };
                patch("plots", plots);
              }}
            />
            <Input
              type="number"
              placeholder="Price"
              value={plot.price}
              onChange={(e) => {
                const plots = [...form.plots] as ProjectPlot[];
                plots[index] = { ...plot, price: Number(e.target.value) };
                patch("plots", plots);
              }}
            />
            <FormSelect
              value={plot.status}
              onValueChange={(status) => {
                const plots = [...form.plots] as ProjectPlot[];
                plots[index] = {
                  ...plot,
                  status: status as ProjectPlot["status"],
                };
                patch("plots", plots);
              }}
              options={[
                { value: "available", label: "Available" },
                { value: "reserved", label: "Reserved" },
                { value: "sold", label: "Sold" },
              ]}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                patch(
                  "plots",
                  form.plots.filter((_, i) => i !== index)
                )
              }
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="gradient-emerald text-white dark:text-white"
        >
          {saving ? "Saving…" : project ? "Update project" : "Create project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
