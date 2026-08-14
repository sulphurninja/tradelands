"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UpcomingLandDrops({ projects }: { projects: Project[] }) {
  const drops = projects.filter(
    (p) =>
      p.status.includes("upcoming") ||
      p.listingBadge === "coming-soon" ||
      p.waitlistEnabled
  );

  if (!drops.length) return null;

  return (
    <section className="container-premium section-pad py-14 sm:py-20">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        Upcoming land drops
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
        Coming soon
      </h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
        Launch anticipation — join the waitlist for early access.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drops.map((project) => (
          <ComingSoonCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ComingSoonCard({ project }: { project: Project }) {
  const acres =
    project.area.maxAcre ||
    (project.area.maxGuntha ? (project.area.maxGuntha / 40).toFixed(0) : "—");
  const stars = Math.round(project.ratingAvg || 5);

  return (
    <article className="rounded-2xl border border-border bg-muted/50 p-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        Coming Soon
      </p>
      <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] uppercase">
        {project.name}
      </h3>
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-4 ${i < stars ? "fill-foreground text-foreground" : "text-muted-foreground/40"}`}
          />
        ))}
      </div>
      <div className="mt-4 space-y-1 text-sm font-medium tracking-[0.06em] uppercase text-muted-foreground">
        <p>{acres}+ acres</p>
        {project.earlyAccess ? <p>Early access</p> : null}
      </div>
      <WaitlistDialog projectSlug={project.slug} projectName={project.name} />
    </article>
  );
}

export function WaitlistDialog({
  projectSlug,
  projectName,
  triggerClassName,
}: {
  projectSlug: string;
  projectName: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug,
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone") || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not join");
        return;
      }
      toast.success("You're on the waitlist");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          triggerClassName ||
          "mt-5 inline-flex h-10 items-center text-sm font-semibold tracking-[0.12em] uppercase text-primary"
        }
      >
        [Join Waitlist]
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join waitlist — {projectName}</DialogTitle>
          <DialogDescription>
            Early access for this upcoming land drop.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="wl-name">Name</Label>
            <Input id="wl-name" name="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wl-email">Email</Label>
            <Input id="wl-email" name="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wl-phone">Phone</Label>
            <Input id="wl-phone" name="phone" type="tel" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting…" : "Join waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
