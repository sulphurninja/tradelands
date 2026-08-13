"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectEngagement({
  slug,
  initialInterest,
  initialAvg,
  initialCount,
}: {
  slug: string;
  initialInterest: number;
  initialAvg: number;
  initialCount: number;
}) {
  const router = useRouter();
  const [interestCount, setInterestCount] = useState(initialInterest);
  const [ratingAvg, setRatingAvg] = useState(initialAvg);
  const [ratingCount, setRatingCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch(`/api/projects/${slug}/view`, { method: "POST" });
  }, [slug]);

  async function interest() {
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${slug}/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not save interest");
        return;
      }
      if (data.already) {
        toast.message("You're already marked as interested");
      } else {
        toast.success("Thanks — we've noted your interest");
        setInterestCount(data.interestCount ?? interestCount + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  async function rate(value: number) {
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${slug}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });
      if (res.status === 401) {
        toast.message("Sign in to rate this project");
        router.push(`/login?next=/projects/${slug}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not save rating");
        return;
      }
      setRatingAvg(data.ratingAvg);
      setRatingCount(data.ratingCount);
      toast.success("Rating saved");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-muted/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
            Community
          </p>
          <p className="mt-0.5 text-sm">
            {ratingAvg > 0 ? (
              <>
                <span className="font-semibold">{ratingAvg.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {ratingCount} rating{ratingCount === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">No ratings yet</span>
            )}
            <span className="text-muted-foreground">
              {" "}
              · {interestCount} interested
            </span>
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={busy}
          onClick={() => void interest()}
          className="rounded-full"
        >
          <Heart className="size-3.5" />
          I&apos;m interested
        </Button>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={busy}
            aria-label={`Rate ${n}`}
            onClick={() => void rate(n)}
            className="rounded p-1 text-muted-foreground transition hover:text-gold"
          >
            <Star
              className={cn(
                "size-5",
                ratingAvg >= n - 0.25 && "fill-gold text-gold"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
