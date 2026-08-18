"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SaleLandDialog } from "@/components/forms/sale-land-dialog";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";

const STORAGE_KEY = "tl-intent-gate-v1";

function BuySellIntentGateInner() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // private mode
    }
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  function onBuy() {
    trackMeta("Lead", { content_name: "Buy Land", content_category: "intent" });
    trackMetaCustom("BuyLandClick", { source: "intent-gate" });
    dismiss();
    router.push("/market");
  }

  function onSell() {
    trackMetaCustom("SellLandClick", { source: "intent-gate" });
    dismiss();
    setSellOpen(true);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) dismiss();
          else setOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-xl tracking-[-0.02em]">
              How can we help you today?
            </DialogTitle>
            <DialogDescription>
              Choose an option and we will take you to the right next step.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid gap-3">
            <button
              type="button"
              onClick={onBuy}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:bg-muted/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Landmark className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  I want to buy land
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Browse live projects and corridor inventory
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={onSell}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-foreground/30 hover:bg-muted/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                <Scale className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  I want to sell land
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Share your details and our team will contact you
                </span>
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <SaleLandDialog
        open={sellOpen}
        onOpenChange={setSellOpen}
        hideTrigger
        source="intent-gate"
      />
    </>
  );
}

/** First-visit buy/sell gate for marketing pages. */
export function BuySellIntentGate() {
  return (
    <Suspense fallback={null}>
      <BuySellIntentGateInner />
    </Suspense>
  );
}
