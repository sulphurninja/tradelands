"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORIES } from "@/lib/constants";
import {
  BULK_BUDGET_OPTIONS,
  BULK_SIZE_OPTIONS,
} from "@/lib/bulk-deals";
import { cn } from "@/lib/utils";

const budgets = [
  { label: "Under ₹50L", value: "0-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr+", value: "30000000-999999999" },
];

const sizes = [
  { label: "Under 1 Acre", value: "0-1" },
  { label: "1–2 Acre", value: "1-2" },
  { label: "2–5 Acre", value: "2-5" },
  { label: "5–10 Acre", value: "5-10" },
  { label: "10+ Acre", value: "10-9999" },
];

export function MarketFilter({
  locations,
}: {
  locations: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const bulk = searchParams.get("bulk") === "1";

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [budget, setBudget] = useState(searchParams.get("budget") || "all");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [size, setSize] = useState(searchParams.get("size") || "all");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setLocation(searchParams.get("location") || "all");
    setBudget(searchParams.get("budget") || "all");
    setCategory(searchParams.get("category") || "all");
    setSize(searchParams.get("size") || "all");
  }, [searchParams]);

  function apply(next?: Record<string, string>) {
    const values = {
      q: next?.q ?? q,
      location: next?.location ?? location,
      budget: next?.budget ?? budget,
      category: next?.category ?? category,
      size: next?.size ?? size,
      featured: searchParams.get("featured") || "",
      bulk: next?.bulk ?? (bulk ? "1" : ""),
    };
    const params = new URLSearchParams();
    if (values.bulk === "1") params.set("bulk", "1");
    if (values.q.trim()) params.set("q", values.q.trim());
    if (values.location !== "all") params.set("location", values.location);
    if (values.budget !== "all") params.set("budget", values.budget);
    if (values.category !== "all") params.set("category", values.category);
    if (values.size !== "all") params.set("size", values.size);
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
      searchParams.get("featured") ||
      searchParams.get("bulk")
  );

  const budgetOptions = bulk ? BULK_BUDGET_OPTIONS : budgets;
  const sizeOptions = bulk ? BULK_SIZE_OPTIONS : sizes;

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="rounded-xl border border-border/80 bg-card p-3 shadow-sm sm:p-4"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setBudget("all");
              setSize("all");
              apply({
                bulk: bulk ? "" : "1",
                budget: "all",
                size: "all",
              });
            }}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-4 text-[11px] font-semibold tracking-[0.08em] uppercase transition",
              bulk
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            )}
          >
            Bulk deals
          </button>
          <p className="text-[11px] text-muted-foreground">
            {bulk
              ? "Bulk Deals · 25–100 acres · ₹25L – ₹5 Cr"
              : "Toggle bulk deals for large parcels from the desk inventory"}
          </p>
        </div>

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

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <FormSelect
            value={location}
            onValueChange={(v) => {
              setLocation(v);
              apply({ location: v });
            }}
            options={[
              { value: "all", label: "Location" },
              ...locations.map((l) => ({ value: l.slug, label: l.name })),
            ]}
          />
          <FormSelect
            value={budget}
            onValueChange={(v) => {
              setBudget(v);
              apply({ budget: v });
            }}
            options={[
              {
                value: "all",
                label: bulk ? "Budget (₹25L–₹5Cr)" : "Budget",
              },
              ...budgetOptions.map((b) => ({
                value: b.value,
                label: b.label,
              })),
            ]}
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
            options={[
              {
                value: "all",
                label: bulk ? "Size (25–100 Ac)" : "Size",
              },
              ...sizeOptions.map((s) => ({
                value: s.value,
                label: s.label,
              })),
            ]}
          />
        </div>
      </form>
    </div>
  );
}
