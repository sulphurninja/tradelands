"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const states = ["Maharashtra", "Karnataka", "Telangana", "Gujarat"];
const budgets = [
  { label: "Under ₹50L", value: "0-5000000" },
  { label: "₹50L – ₹1Cr", value: "5000000-10000000" },
  { label: "₹1Cr – ₹3Cr", value: "10000000-30000000" },
  { label: "₹3Cr+", value: "30000000-999999999" },
];

export function PropertySearch({
  initial,
  trending = [],
}: {
  initial?: {
    q?: string;
    state?: string;
    category?: string;
    budget?: string;
    stage?: string;
  };
  trending?: { slug: string; name: string; locationLabel?: string }[];
}) {
  const router = useRouter();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(initial?.q || "");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initial?.state || "all");
  const [category, setCategory] = useState(initial?.category || "all");
  const [budget, setBudget] = useState(initial?.budget || "all");
  const [stage, setStage] = useState(initial?.stage || "all");

  const suggestions = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return trending;
    return trending.filter((t) => {
      const hay =
        `${t.name} ${t.locationLabel || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, trending]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goProject(slug: string) {
    setOpen(false);
    router.push(`/projects/${slug}`);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    const exact = suggestions.find(
      (t) => t.name.toLowerCase() === q.trim().toLowerCase()
    );
    if (exact) {
      goProject(exact.slug);
      return;
    }
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (state !== "all") params.set("state", state);
    if (category !== "all") params.set("category", category);
    if (budget !== "all") params.set("budget", budget);
    if (stage !== "all") params.set("stage", stage);
    const qs = params.toString();
    router.push(qs ? `/market?${qs}` : "/market");
  }

  const triggerClass =
    "h-9 w-full min-w-0 border-0 bg-transparent px-3 shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent";

  const showPanel = open && trending.length > 0;

  return (
    <form
      onSubmit={onSearch}
      className="w-full min-w-0 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4"
    >
      <div ref={wrapRef} className="relative mb-2 min-w-0">
        <label className="sr-only" htmlFor="home-q">
          Search
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="home-q"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Search by name, village, or district…"
          className="h-11 w-full rounded-xl border-border/80 bg-background pl-10"
          autoComplete="off"
        />

        {showPanel ? (
          <div
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <TrendingUp className="size-3.5 text-primary" />
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {q.trim() ? "Matching picks" : "Trending now"}
              </p>
            </div>
            <ul className="max-h-64 overflow-y-auto py-1">
              {suggestions.length ? (
                suggestions.map((item) => (
                  <li key={item.slug} role="option">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goProject(item.slug)}
                      className={cn(
                        "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                      )}
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {item.name}
                        </span>
                        {item.locationLabel ? (
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {item.locationLabel}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-3 text-sm text-muted-foreground">
                  No trending match — hit Search to browse the market.
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </div>

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

        <SearchField label="Stage">
          <FormSelect
            value={stage}
            onValueChange={setStage}
            triggerClassName={triggerClass}
            placeholder="Any stage"
            options={[
              { value: "all", label: "Any stage" },
              { value: "developed", label: "Developed" },
              { value: "under-development", label: "Under development" },
            ]}
          />
        </SearchField>

        <Button
          type="submit"
          className="h-11 w-full touch-manipulation rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90 sm:col-span-2 lg:col-span-1 lg:mb-1 lg:h-10 lg:w-auto"
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
