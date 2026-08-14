"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "@/lib/types";

const times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export function SiteVisitForm({
  defaultProject,
  onSuccess,
}: {
  defaultProject?: string;
  onSuccess?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSlug, setProjectSlug] = useState(defaultProject || "");
  const [time, setTime] = useState(times[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.projects || []) as Project[];
        setProjects(list);
        if (!defaultProject && list[0]) {
          setProjectSlug(list[0].slug);
        }
      })
      .catch(() => {
        toast.error("Could not load projects. Refresh and try again.");
      });
  }, [defaultProject]);

  useEffect(() => {
    if (defaultProject) setProjectSlug(defaultProject);
  }, [defaultProject]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data.user as { name?: string; email?: string } | null;
      })
      .then((user) => {
        if (!user) return;
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = formRef.current;
    if (!projectSlug) {
      toast.error("Please select a project");
      return;
    }
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\s+/g, "").trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      toast.error("Please enter your full name");
      return;
    }
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const date = String(new FormData(e.currentTarget).get("date") || "");
    if (!date) {
      toast.error("Please pick a preferred date");
      return;
    }

    setLoading(true);
    const payload = {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      projectSlug,
      date,
      time,
      pickupRequired: false,
      pickupAddress: "",
      referralCode:
        String(new FormData(formEl || e.currentTarget).get("referralCode") || "")
          .trim() || undefined,
    };

    try {
      const res = await fetch("/api/site-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string; ok?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON */
      }

      if (!res.ok) {
        toast.error(data.error || "Could not book visit. Please try again.");
        return;
      }

      toast.success("Site visit requested. We will confirm shortly.");
      formEl?.reset();
      setName(cleanName);
      setPhone("");
      setEmail(cleanEmail);
      setTime(times[0]);
      if (defaultProject) setProjectSlug(defaultProject);
      onSuccess?.();
    } catch (err) {
      console.error("site visit submit failed", err);
      toast.error("Unable to submit right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            required
            className="h-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            className="h-10"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
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
      <Button
        type="submit"
        disabled={loading || !projectSlug}
        className="h-11 w-full gradient-emerald sm:w-auto sm:px-10"
      >
        {loading ? "Submitting…" : "Confirm Site Visit Request"}
      </Button>
    </form>
  );
}
