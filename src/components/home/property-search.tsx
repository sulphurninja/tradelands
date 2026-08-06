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

export function PropertySearch() {
  const router = useRouter();
  const [state, setState] = useState("all");
  const [category, setCategory] = useState("all");
  const [budget, setBudget] = useState("all");
  const [attribute, setAttribute] = useState("all");

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
    "h-9 border-0 bg-transparent px-3 shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent";

  return (
    <form
      onSubmit={onSearch}
      className="glass rounded-2xl p-3 sm:p-4 lg:rounded-3xl"
    >
      <div className="grid items-end gap-2 lg:grid-cols-[1.1fr_1.1fr_1.1fr_1.1fr_auto]">
        <div className="flex min-h-[4.5rem] flex-col justify-end rounded-xl bg-background/75 px-1 pb-1 pt-2.5 dark:bg-background/55">
          <span className="px-3 pb-1 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
            State
          </span>
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
        </div>

        <div className="flex min-h-[4.5rem] flex-col justify-end rounded-xl bg-background/75 px-1 pb-1 pt-2.5 dark:bg-background/55">
          <span className="px-3 pb-1 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
            Category
          </span>
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
        </div>

        <div className="flex min-h-[4.5rem] flex-col justify-end rounded-xl bg-background/75 px-1 pb-1 pt-2.5 dark:bg-background/55">
          <span className="px-3 pb-1 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
            Budget
          </span>
          <FormSelect
            value={budget}
            onValueChange={setBudget}
            triggerClassName={triggerClass}
            placeholder="Any Budget"
            options={[
              { value: "all", label: "Any Budget" },
              ...budgets,
            ]}
          />
        </div>

        <div className="flex min-h-[4.5rem] flex-col justify-end rounded-xl bg-background/75 px-1 pb-1 pt-2.5 dark:bg-background/55">
          <span className="px-3 pb-1 text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
            Attribute
          </span>
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
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-14 w-full rounded-xl gradient-emerald px-8 text-white lg:min-h-[4.5rem]"
        >
          <Search className="size-4" />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
}
