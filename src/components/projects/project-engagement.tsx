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
  const [busy, setBusy] = useState<"interest" | "rate" | null>(null);
  const [myRating, setMyRating] = useState(0);

  useEffect(() => {
    void fetch(`/api/projects/${slug}/view`, { method: "POST" });
  }, [slug]);

  async function interest() {
    if (busy) return;
    setBusy("interest");
    try {
      const res = await fetch(`/api/projects/${slug}/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not save interest");
        return;
      }
      if (data.already) {
        toast.message("You're already marked as interested");
      } else {
        toast.success("Thanks — we've noted your interest");
        setInterestCount(Number(data.interestCount) || interestCount + 1);
      }
    } catch {
      toast.error("Could not save interest. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function rate(value: number) {
    if (busy) return;
    setBusy("rate");
    setMyRating(value);
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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not save rating");
        return;
      }
      setRatingAvg(Number(data.ratingAvg) || value);
      setRatingCount(Number(data.ratingCount) || ratingCount);
      toast.success("Rating saved");
    } catch {
      toast.error("Could not save rating. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-muted/40 p-4">
      <div className="space-y-3">
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
          disabled={busy === "interest"}
          onClick={() => void interest()}
          className="h-11 w-full touch-manipulation rounded-full sm:h-9 sm:w-auto"
        >
          <Heart className="size-3.5" />
          I&apos;m interested
        </Button>
      </div>
      <div>
        <p className="mb-2 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
          Rate this land
        </p>
        <div className="flex items-center justify-between gap-1 sm:justify-start sm:gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              disabled={busy === "rate"}
              aria-label={`Rate ${n} stars`}
              onClick={() => void rate(n)}
              className="inline-flex size-11 touch-manipulation items-center justify-center rounded-lg text-muted-foreground transition hover:bg-background hover:text-gold active:scale-95 disabled:opacity-50 sm:size-10"
            >
              <Star
                className={cn(
                  "size-6 sm:size-5",
                  (myRating >= n || (!myRating && ratingAvg >= n - 0.25)) &&
                    "fill-gold text-gold"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
