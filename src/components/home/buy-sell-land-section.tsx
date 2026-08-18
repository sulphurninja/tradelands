"use client";

import Link from "next/link";
import { ArrowRight, Landmark, Scale } from "lucide-react";
import { SaleLandDialog } from "@/components/forms/sale-land-dialog";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";

export function BuySellLandSection() {
  return (
    <section
      id="buy-sell-land"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <div className="container-premium section-pad py-14 sm:py-18 lg:py-22">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Buy & sell
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Buy land or sell with TradeLands
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Browse curated inventory as a buyer, or submit your parcel for
            review if you are ready to sell.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-5">
          <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Landmark className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
              Buy land
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Explore live corridor projects with clear acre rates, sizing, and
              verified listings.
            </p>
            <Link
              href="/market"
              onClick={() => {
                trackMeta("Lead", {
                  content_name: "Buy Land",
                  content_category: "buy",
                });
                trackMetaCustom("BuyLandClick", { source: "homepage" });
              }}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              View projects
              <ArrowRight className="size-4" />
            </Link>
          </article>

          <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <div className="flex size-11 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
              <Scale className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
              Sell land
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Submit your name, email, phone number, land size, location, rate,
              and documents. Our team will follow up.
            </p>
            <div className="mt-6">
              <SaleLandDialog
                triggerLabel="List your land"
                triggerClassName="h-12 w-full border border-border bg-foreground text-background hover:bg-foreground/90"
                source="homepage-sale-land"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
