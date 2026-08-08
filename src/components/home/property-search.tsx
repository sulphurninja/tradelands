"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORIES, LOCATION_ATTRIBUTES } from "@/lib/constants";

const states = ["Maharashtra", "Karnataka", "Telangana", "Gujarat"];
const budgets = [
  { label: "Under ₹50L", value: "0-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr+", value: "30000000-999999999" },
];

export function PropertySearch({
  initial,
}: {
  initial?: {
    state?: string;
    category?: string;
    budget?: string;
    attribute?: string;
  };
}) {
  const router = useRouter();
  const [state, setState] = useState(initial?.state || "all");
  const [category, setCategory] = useState(initial?.category || "all");
  const [budget, setBudget] = useState(initial?.budget || "all");
  const [attribute, setAttribute] = useState(initial?.attribute || "all");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (state !== "all") params.set("state", state);
    if (category !== "all") params.set("category", category);
    if (budget !== "all") params.set("budget", budget);
    if (attribute !== "all") params.set("attribute", attribute);
    router.push(`/projects?${params.toString()}`);
  }

  const triggerClass =
    "h-9 w-full min-w-0 border-0 bg-transparent px-3 shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent";

  return (
    <form
      onSubmit={onSearch}
      className="w-full min-w-0 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4"
    >
      <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <SearchField label="State">
          <FormSelect
            value={state}
            onValueChange={setState}
            triggerClassName={triggerClass}
            placeholder="All States"
            options={[
              { value: "all", label: "All States" },
              ...states.map((s) => ({ value: s, label: s })),
            ]}
          />
        </SearchField>

        <SearchField label="Category">
          <FormSelect
            value={category}
            onValueChange={setCategory}
            triggerClassName={triggerClass}
            placeholder="All Categories"
            options={[
              { value: "all", label: "All Categories" },
              ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
            ]}
          />
        </SearchField>

        <SearchField label="Budget">
          <FormSelect
            value={budget}
            onValueChange={setBudget}
            triggerClassName={triggerClass}
            placeholder="Any Budget"
            options={[{ value: "all", label: "Any Budget" }, ...budgets]}
          />
        </SearchField>

        <SearchField label="Attribute">
          <FormSelect
            value={attribute}
            onValueChange={setAttribute}
            triggerClassName={triggerClass}
            placeholder="Any Attribute"
            options={[
              { value: "all", label: "Any Attribute" },
              ...LOCATION_ATTRIBUTES.map((a) => ({
                value: a.value,
                label: a.label,
              })),
            ]}
          />
        </SearchField>

        <Button
          type="submit"
          className="h-11 w-full rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90 sm:col-span-2 lg:col-span-1 lg:mb-1 lg:h-10 lg:w-auto"
        >
          <Search className="size-4" />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
}

function SearchField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[4.5rem] min-w-0 flex-col justify-end rounded-xl bg-background/75 px-1 pt-2.5 pb-1 dark:bg-background/55">
      <span className="px-3 pb-1 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
