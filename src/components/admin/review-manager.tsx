"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeleteButton } from "@/components/admin/delete-button";

export function ReviewManager({ initial }: { initial: Review[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 5,
    quote: "",
    project: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed");
      return;
    }
    setItems((prev) => [data.review, ...prev]);
    setForm({ name: "", location: "", rating: 5, quote: "", project: "" });
    toast.success("Review added");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border p-5">
        <h2 className="font-display text-xl">Add review</h2>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: Number(e.target.value) }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Project</Label>
          <Input
            value={form.project}
            onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Quote</Label>
          <Textarea
            required
            rows={4}
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
          />
        </div>
        <Button type="submit" className="gradient-emerald text-white">
          Add review
        </Button>
      </form>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.location} · {item.project}
                </p>
              </div>
              <DeleteButton endpoint={`/api/admin/reviews/${item.id}`} />
            </div>
            <p className="mt-3 text-sm">“{item.quote}”</p>
          </div>
        ))}
      </div>
    </div>
  );
}
