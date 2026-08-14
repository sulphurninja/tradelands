"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MarketLocationItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DeleteButton } from "@/components/admin/delete-button";

const empty = {
  name: "",
  slug: "",
  lat: 18.9,
  lng: 73.3,
  changePct: 0,
  sortOrder: 0,
  active: true,
  seriesText: "2023 200\n2024 250\n2025 300\n2026 350",
};

export function MarketLocationManager({
  initial,
}: {
  initial: MarketLocationItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadEdit(item: MarketLocationItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      lat: item.lat,
      lng: item.lng,
      changePct: item.changePct,
      sortOrder: item.sortOrder,
      active: item.active,
      seriesText: item.series
        .map((p) => `${p.year} ${p.pricePerSqFt}`)
        .join("\n"),
    });
  }

  function reset() {
    setEditingId(null);
    setForm(empty);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        editingId
          ? `/api/admin/market-locations/${editingId}`
          : "/api/admin/market-locations",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      if (editingId) {
        setItems((prev) =>
          prev.map((i) => (i.id === editingId ? data.item : i))
        );
        toast.success("Updated");
      } else {
        setItems((prev) => [data.item, ...prev]);
        toast.success("Added");
      }
      reset();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="font-medium">
          {editingId ? "Edit location" : "Add location"}
        </h2>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Lat</Label>
            <Input
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) =>
                setForm({ ...form, lat: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Lng</Label>
            <Input
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) =>
                setForm({ ...form, lng: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Change %</Label>
            <Input
              type="number"
              step="0.1"
              value={form.changePct}
              onChange={(e) =>
                setForm({ ...form, changePct: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Sort</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Series (year price per line)</Label>
          <Textarea
            rows={5}
            value={form.seriesText}
            onChange={(e) => setForm({ ...form, seriesText: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={form.active}
            onCheckedChange={(v) => setForm({ ...form, active: v })}
          />
          Active
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Update" : "Add"}
          </Button>
          {editingId ? (
            <Button type="button" variant="ghost" onClick={reset}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.series.length} points · {item.changePct > 0 ? "+" : ""}
                {item.changePct}%
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => loadEdit(item)}
              >
                Edit
              </Button>
              <DeleteButton
                endpoint={`/api/admin/market-locations/${item.id}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
