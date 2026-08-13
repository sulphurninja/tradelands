"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/types";

const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export function SiteVisitForm({
  defaultProject,
  onSuccess,
}: {
  defaultProject?: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSlug, setProjectSlug] = useState(defaultProject || "");
  const [time, setTime] = useState(times[0]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.projects || []) as Project[];
        setProjects(list);
        if (!defaultProject && list[0]) {
          setProjectSlug(list[0].slug);
        }
      });
  }, [defaultProject]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectSlug) {
      toast.error("Please select a project");
      return;
    }
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      phone: String(form.get("phone")),
      email: String(form.get("email") || ""),
      projectSlug,
      date: String(form.get("date")),
      time,
      pickupRequired: pickup,
      pickupAddress: String(form.get("pickupAddress") || ""),
      referralCode: String(form.get("referralCode") || "").trim() || undefined,
    };

    try {
      const res = await fetch("/api/site-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not book visit");
        return;
      }
      toast.success("Site visit requested. We will confirm shortly.");
      e.currentTarget.reset();
      setPickup(false);
      setTime(times[0]);
      onSuccess?.();
    } catch {
      toast.error("Unable to submit right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required className="h-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" className="h-10" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="referralCode">Agent / CP referral code (optional)</Label>
        <Input
          id="referralCode"
          name="referralCode"
          className="h-10"
          placeholder="e.g. TL-AGENT01"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="projectSlug">Project</Label>
        <FormSelect
          id="projectSlug"
          name="projectSlug"
          required
          value={projectSlug}
          onValueChange={setProjectSlug}
          placeholder="Select project"
          options={projects.map((p) => ({
            value: p.slug,
            label: `${p.name} — ${p.location.district}`,
          }))}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Preferred date</Label>
          <Input id="date" name="date" type="date" required className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time slot</Label>
          <FormSelect
            id="time"
            name="time"
            required
            value={time}
            onValueChange={setTime}
            placeholder="Select time"
            options={times.map((t) => ({ value: t, label: t }))}
          />
        </div>
      </div>
      <label className="flex h-10 items-center gap-2.5 text-sm">
        <Checkbox
          checked={pickup}
          onCheckedChange={(checked) => setPickup(checked)}
        />
        Request pickup
      </label>
      {pickup && (
        <div className="space-y-2">
          <Label htmlFor="pickupAddress">Pickup address</Label>
          <Textarea id="pickupAddress" name="pickupAddress" rows={3} />
        </div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full gradient-emerald text-white dark:text-white sm:w-auto sm:px-10"
      >
        {loading ? "Submitting…" : "Confirm Site Visit Request"}
      </Button>
    </form>
  );
}
