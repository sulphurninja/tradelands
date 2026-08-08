"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EnquiryForm({ interest }: { interest?: string }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name")),
          phone: String(form.get("phone")),
          email: String(form.get("email") || ""),
          interest: interest || String(form.get("interest") || ""),
          message: String(form.get("message") || ""),
          source: "contact",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not send enquiry");
        return;
      }
      toast.success("Enquiry received. Our desk will call you.");
      e.currentTarget.reset();
    } catch {
      toast.error("Unable to reach server. Is MongoDB connected?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      {!interest && (
        <div className="space-y-2">
          <Label htmlFor="interest">Interest</Label>
          <Input
            id="interest"
            name="interest"
            placeholder="Agriculture / NA / Farm House"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="gradient-emerald text-white dark:text-white"
      >
        {loading ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
