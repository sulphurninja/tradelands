"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/ui/form-select";
import { LIVE_MARKET_CORRIDORS } from "@/lib/market-corridors";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";

const KM_OPTIONS = [
  { value: "0-5", label: "Within 5 km" },
  { value: "5-10", label: "5–10 km" },
  { value: "10-25", label: "10–25 km" },
  { value: "25-50", label: "25–50 km" },
  { value: "50-100", label: "50–100 km" },
];

const PRICE_OPTIONS = [
  { value: "under-50l", label: "Under ₹50L" },
  { value: "50l-1cr", label: "₹50L – ₹1 Cr" },
  { value: "1cr-3cr", label: "₹1 Cr – ₹3 Cr" },
  { value: "3cr-5cr", label: "₹3 Cr – ₹5 Cr" },
  { value: "5cr-plus", label: "₹5 Cr+" },
];

export function MyRequirementSection() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [location, setLocation] = useState("");
  const [kmRange, setKmRange] = useState("");
  const [priceRange, setPriceRange] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!location || !kmRange || !priceRange) {
      toast.error("Please select location, distance, and price range.");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const acres = Number(data.get("acres"));
    if (!Number.isFinite(acres) || acres < 5 || acres > 100) {
      toast.error("Acres must be between 5 and 100.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          phone: String(data.get("phone") || ""),
          location,
          kmRange,
          acres,
          priceRange,
          source: "homepage-requirement",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.error || "Submission failed");
        return;
      }

      trackMeta("Lead", {
        content_name: "My Requirement",
        content_category: "requirement",
      });
      trackMetaCustom("RequirementSubmit", { source: "homepage" });
      setDone(true);
      form.reset();
      setLocation("");
      setKmRange("");
      setPriceRange("");
      toast.success("Requirement submitted");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      id="my-requirement"
      className="scroll-mt-24 border-y border-border bg-background"
    >
      <div className="container-premium section-pad py-14 sm:py-18 lg:py-22">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Buyer desk
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              My requirement
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell us what you are looking for — location, distance band, acre
              size (5–100), and budget. Our team will match suitable parcels and
              get back to you.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 size-4 shrink-0 text-primary" />
                Live Maharashtra locations with km range
              </li>
              <li className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 size-4 shrink-0 text-primary" />
                Acre size from 5 to 100 acres
              </li>
              <li className="flex items-start gap-2">
                <ClipboardList className="mt-0.5 size-4 shrink-0 text-primary" />
                Clear price bands for faster matching
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            {done ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="size-12 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">
                  Requirement received
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  A member of our team will contact you shortly with matching
                  options.
                </p>
                <Button
                  className="mt-6 rounded-full"
                  variant="outline"
                  onClick={() => setDone(false)}
                >
                  Submit another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="req-name">Name</Label>
                  <Input
                    id="req-name"
                    name="name"
                    required
                    minLength={2}
                    placeholder="Full name"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="req-phone">Contact number</Label>
                  <Input
                    id="req-phone"
                    name="phone"
                    type="tel"
                    required
                    minLength={10}
                    placeholder="+917977076969"
                    autoComplete="tel"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <FormSelect
                      value={location || "unset"}
                      onValueChange={(v) =>
                        setLocation(v === "unset" ? "" : v)
                      }
                      options={[
                        { value: "unset", label: "Select location" },
                        ...LIVE_MARKET_CORRIDORS.map((c) => ({
                          value: c.slug,
                          label: c.name,
                        })),
                      ]}
                      triggerClassName="h-10 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Distance from location</Label>
                    <FormSelect
                      value={kmRange || "unset"}
                      onValueChange={(v) =>
                        setKmRange(v === "unset" ? "" : v)
                      }
                      options={[
                        { value: "unset", label: "Select km range" },
                        ...KM_OPTIONS,
                      ]}
                      triggerClassName="h-10 w-full"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="req-acres">Acres (5–100)</Label>
                    <Input
                      id="req-acres"
                      name="acres"
                      type="number"
                      required
                      min={5}
                      max={100}
                      step={1}
                      placeholder="e.g. 12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price range</Label>
                    <FormSelect
                      value={priceRange || "unset"}
                      onValueChange={(v) =>
                        setPriceRange(v === "unset" ? "" : v)
                      }
                      options={[
                        { value: "unset", label: "Select budget" },
                        ...PRICE_OPTIONS,
                      ]}
                      triggerClassName="h-10 w-full"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={pending}
                  className="h-11 w-full rounded-full"
                >
                  {pending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit requirement"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
