"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import {
  CATEGORIES,
  INVESTMENT_HORIZONS,
  LOCATION_ATTRIBUTES,
} from "@/lib/constants";

const budgets = [
  { label: "Under ₹50L", value: "0-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr+", value: "30000000-999999999" },
];

const sizes = [
  { label: "Under 10 Guntha", value: "0-10" },
  { label: "10–25 Guntha", value: "10-25" },
  { label: "25–50 Guntha", value: "25-50" },
  { label: "50+ Guntha", value: "50-9999" },
];

const growthBands = [
  { label: "Any growth", value: "all" },
  { label: "8%+", value: "8" },
  { label: "12%+", value: "12" },
  { label: "15%+", value: "15" },
];

export function MarketFilter({
  locations,
}: {
  locations: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [budget, setBudget] = useState(searchParams.get("budget") || "all");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [size, setSize] = useState(searchParams.get("size") || "all");
  const [growth, setGrowth] = useState(searchParams.get("growth") || "all");
  const [horizon, setHorizon] = useState(searchParams.get("horizon") || "all");
  const [attribute, setAttribute] = useState(
    searchParams.get("attribute") || "all"
  );

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setLocation(searchParams.get("location") || "all");
    setBudget(searchParams.get("budget") || "all");
    setCategory(searchParams.get("category") || "all");
    setSize(searchParams.get("size") || "all");
    setGrowth(searchParams.get("growth") || "all");
    setHorizon(searchParams.get("horizon") || "all");
    setAttribute(searchParams.get("attribute") || "all");
  }, [searchParams]);

  function apply(next?: Record<string, string>) {
    const values = {
      q: next?.q ?? q,
      location: next?.location ?? location,
      budget: next?.budget ?? budget,
      category: next?.category ?? category,
      size: next?.size ?? size,
      growth: next?.growth ?? growth,
      horizon: next?.horizon ?? horizon,
      attribute: next?.attribute ?? attribute,
      featured: searchParams.get("featured") || "",
    };
    const params = new URLSearchParams();
    if (values.q.trim()) params.set("q", values.q.trim());
    if (values.location !== "all") params.set("location", values.location);
    if (values.budget !== "all") params.set("budget", values.budget);
    if (values.category !== "all") params.set("category", values.category);
    if (values.size !== "all") params.set("size", values.size);
    if (values.growth !== "all") params.set("growth", values.growth);
    if (values.horizon !== "all") params.set("horizon", values.horizon);
    if (values.attribute !== "all") params.set("attribute", values.attribute);
    if (values.featured) params.set("featured", values.featured);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/market?${qs}` : "/market");
    });
  }

  const hasFilters = Boolean(
    searchParams.get("q") ||
      searchParams.get("location") ||
      searchParams.get("budget") ||
      searchParams.get("category") ||
      searchParams.get("size") ||
      searchParams.get("growth") ||
      searchParams.get("horizon") ||
      searchParams.get("attribute") ||
      searchParams.get("featured")
  );

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="rounded-xl border border-border/80 bg-card p-3 shadow-sm sm:p-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, village, or district…"
              className="h-11 border-border/80 bg-background pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2 lg:shrink-0">
            <Button
              type="submit"
              disabled={pending}
              className="h-11 min-w-[7.5rem] rounded-lg"
            >
              {pending ? "Filtering…" : "Apply"}
            </Button>
            {hasFilters ? (
              <Button asChild variant="outline" className="h-11 rounded-lg">
                <Link href="/market">
                  <X className="size-3.5" />
                  Clear
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <FormSelect
            value={location}
            onValueChange={(v) => {
              setLocation(v);
              apply({ location: v });
            }}
            options={[
              { value: "all", label: "Corridor" },
              ...locations.map((l) => ({ value: l.slug, label: l.name })),
            ]}
          />
          <FormSelect
            value={budget}
            onValueChange={(v) => {
              setBudget(v);
              apply({ budget: v });
            }}
            options={[{ value: "all", label: "Budget" }, ...budgets]}
          />
          <FormSelect
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              apply({ category: v });
            }}
            options={[
              { value: "all", label: "Land type" },
              ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
            ]}
          />
          <FormSelect
            value={size}
            onValueChange={(v) => {
              setSize(v);
              apply({ size: v });
            }}
            options={[{ value: "all", label: "Size" }, ...sizes]}
          />
          <FormSelect
            value={growth}
            onValueChange={(v) => {
              setGrowth(v);
              apply({ growth: v });
            }}
            options={growthBands}
          />
          <FormSelect
            value={horizon}
            onValueChange={(v) => {
              setHorizon(v);
              apply({ horizon: v });
            }}
            options={[
              { value: "all", label: "Horizon" },
              ...INVESTMENT_HORIZONS.map((h) => ({
                value: h.value,
                label: h.label,
              })),
            ]}
          />
          <FormSelect
            value={attribute}
            onValueChange={(v) => {
              setAttribute(v);
              apply({ attribute: v });
            }}
            options={[
              { value: "all", label: "Attribute" },
              ...LOCATION_ATTRIBUTES.map((a) => ({
                value: a.value,
                label: a.label,
              })),
            ]}
          />
        </div>
      </form>
    </div>
  );
}
