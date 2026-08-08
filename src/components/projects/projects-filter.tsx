"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORIES, LOCATION_ATTRIBUTES } from "@/lib/constants";

const states = ["Maharashtra", "Karnataka", "Telangana", "Gujarat"];
const budgets = [
  { label: "Under ₹50L", value: "0-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr+", value: "30000000-999999999" },
];

export function ProjectsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [state, setState] = useState(searchParams.get("state") || "all");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [budget, setBudget] = useState(searchParams.get("budget") || "all");
  const [attribute, setAttribute] = useState(
    searchParams.get("attribute") || "all"
  );

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setState(searchParams.get("state") || "all");
    setCategory(searchParams.get("category") || "all");
    setBudget(searchParams.get("budget") || "all");
    setAttribute(searchParams.get("attribute") || "all");
  }, [searchParams]);

  const hasFilters =
    Boolean(searchParams.get("q")) ||
    Boolean(searchParams.get("state")) ||
    Boolean(searchParams.get("category")) ||
    Boolean(searchParams.get("budget")) ||
    Boolean(searchParams.get("attribute"));

  function apply(next?: {
    q?: string;
    state?: string;
    category?: string;
    budget?: string;
    attribute?: string;
  }) {
    const params = new URLSearchParams();
    const values = {
      q: next?.q ?? q,
      state: next?.state ?? state,
      category: next?.category ?? category,
      budget: next?.budget ?? budget,
      attribute: next?.attribute ?? attribute,
    };

    if (values.q.trim()) params.set("q", values.q.trim());
    if (values.state !== "all") params.set("state", values.state);
    if (values.category !== "all") params.set("category", values.category);
    if (values.budget !== "all") params.set("budget", values.budget);
    if (values.attribute !== "all") params.set("attribute", values.attribute);

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/projects?${qs}` : "/projects");
    });
  }

  function onSelect(
    key: "state" | "category" | "budget" | "attribute",
    value: string
  ) {
    if (key === "state") setState(value);
    if (key === "category") setCategory(value);
    if (key === "budget") setBudget(value);
    if (key === "attribute") setAttribute(value);
    apply({ [key]: value });
  }

  return (
    <div className="mb-8 space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4"
      >
        <div className="mb-3">
          <label className="sr-only" htmlFor="project-q">
            Search projects
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="project-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, village, or district…"
              className="h-11 rounded-xl border-border/80 bg-background pl-10"
            />
          </div>
        </div>

        <div className="grid items-end gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <FilterField label="State">
            <FormSelect
              value={state}
              onValueChange={(v) => onSelect("state", v)}
              options={[
                { value: "all", label: "All States" },
                ...states.map((s) => ({ value: s, label: s })),
              ]}
              triggerClassName="h-10 border-0 bg-transparent shadow-none"
            />
          </FilterField>

          <FilterField label="Category">
            <FormSelect
              value={category}
              onValueChange={(v) => onSelect("category", v)}
              options={[
                { value: "all", label: "All Categories" },
                ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
              ]}
              triggerClassName="h-10 border-0 bg-transparent shadow-none"
            />
          </FilterField>

          <FilterField label="Budget">
            <FormSelect
              value={budget}
              onValueChange={(v) => onSelect("budget", v)}
              options={[{ value: "all", label: "Any Budget" }, ...budgets]}
              triggerClassName="h-10 border-0 bg-transparent shadow-none"
            />
          </FilterField>

          <FilterField label="Attribute">
            <FormSelect
              value={attribute}
              onValueChange={(v) => onSelect("attribute", v)}
              options={[
                { value: "all", label: "Any Attribute" },
                ...LOCATION_ATTRIBUTES.map((a) => ({
                  value: a.value,
                  label: a.label,
                })),
              ]}
              triggerClassName="h-10 border-0 bg-transparent shadow-none"
            />
          </FilterField>

          <Button
            type="submit"
            disabled={pending}
            className="h-10 w-full rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90 lg:mb-0.5 lg:w-auto"
          >
            <Search className="size-4" />
            Search
          </Button>
        </div>
      </form>

      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">Active filters</p>
          {(
            [
              ["q", searchParams.get("q")],
              ["state", searchParams.get("state")],
              ["category", searchParams.get("category")],
              ["budget", searchParams.get("budget")],
              ["attribute", searchParams.get("attribute")],
            ] as const
          )
            .filter(([, value]) => value)
            .map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {key === "category"
                  ? CATEGORIES.find((c) => c.value === value)?.label || value
                  : key === "budget"
                    ? budgets.find((b) => b.value === value)?.label || value
                    : key === "attribute"
                      ? LOCATION_ATTRIBUTES.find((a) => a.value === value)
                          ?.label || value
                      : value}
              </span>
            ))}
          <Button asChild variant="ghost" size="sm" className="h-8 px-2">
            <Link href="/projects">
              <X className="size-3.5" />
              Clear all
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-muted/60 px-1 pt-2 pb-1">
      <span className="px-3 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
