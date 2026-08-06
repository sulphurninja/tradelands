"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/format";

export default function ToolsPage() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(10);
  const [guntha, setGuntha] = useState(10);
  const [pricePerGuntha, setPricePerGuntha] = useState(250000);

  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }, [principal, rate, years]);

  const acre = guntha / 40;
  const sqft = guntha * 1089;
  const landCost = guntha * pricePerGuntha;

  return (
    <>
      <PageHero
        eyebrow="Investment Tools"
        title="Calculators"
        description="EMI, land area converters, and quick cost models for diligence."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-8">
            <h2 className="font-display text-2xl">EMI Calculator</h2>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Loan amount (₹)</Label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Interest rate (%)</Label>
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tenure (years)</Label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
              </div>
              <p className="rounded-xl bg-muted/70 px-4 py-3">
                Monthly EMI:{" "}
                <span className="font-medium text-primary">
                  {formatINR(Math.round(emi))}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-8">
            <h2 className="font-display text-2xl">Land Area & Cost</h2>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Area (Guntha)</Label>
                <Input
                  type="number"
                  value={guntha}
                  onChange={(e) => setGuntha(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Price / Guntha (₹)</Label>
                <Input
                  type="number"
                  value={pricePerGuntha}
                  onChange={(e) => setPricePerGuntha(Number(e.target.value))}
                />
              </div>
              <dl className="space-y-2 rounded-xl bg-muted/70 px-4 py-3 text-sm">
                <div className="flex justify-between">
                  <dt>Acre</dt>
                  <dd>{acre.toFixed(3)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Sq.ft (approx)</dt>
                  <dd>{sqft.toLocaleString("en-IN")}</dd>
                </div>
                <div className="flex justify-between font-medium text-primary">
                  <dt>Estimated cost</dt>
                  <dd>{formatINR(landCost)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          ROI, plantation income, rental, construction cost, and stamp duty
          calculators expand from this toolkit module.
        </p>
      </section>
    </>
  );
}
