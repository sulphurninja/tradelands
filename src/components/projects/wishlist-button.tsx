"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function WishlistButton({
  projectSlug,
  className,
  variant = "icon",
}: {
  projectSlug: string;
  className?: string;
  variant?: "icon" | "button";
}) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.slugs) return;
        setActive(data.slugs.includes(projectSlug));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [projectSlug]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: active ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug }),
      });
      if (res.status === 401) {
        toast.message("Sign in to save favorites");
        router.push(`/login?next=/projects/${projectSlug}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not update wishlist");
        return;
      }
      setActive(!active);
      toast.success(active ? "Removed from wishlist" : "Saved to wishlist");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant={active ? "default" : "outline"}
        className={cn("h-11", className)}
        disabled={loading}
        onClick={toggle}
      >
        <Heart className={cn("size-4", active && "fill-current")} />
        {active ? "Saved" : "Save to wishlist"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      disabled={loading}
      onClick={toggle}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50",
        active && "border-rose-300/50 text-rose-200",
        className
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </button>
  );
}
