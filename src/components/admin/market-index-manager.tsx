"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MarketIndexItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DeleteButton } from "@/components/admin/delete-button";

const empty = {
  name: "",
  slug: "",
  pricePerSqFt: 200,
  changePct: 0,
  sortOrder: 0,
  featured: true,
  active: true,
};

export function MarketIndexManager({
  initial,
}: {
  initial: MarketIndexItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadEdit(item: MarketIndexItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      pricePerSqFt: item.pricePerSqFt,
      changePct: item.changePct,
      sortOrder: item.sortOrder,
      featured: item.featured,
      active: item.active,
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
          ? `/api/admin/market-index/${editingId}`
          : "/api/admin/market-index",
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
          {editingId ? "Edit index row" : "Add index row"}
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
            placeholder="auto from name if empty"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>₹ / sq.ft</Label>
            <Input
              type="number"
              value={form.pricePerSqFt}
              onChange={(e) =>
                setForm({ ...form, pricePerSqFt: Number(e.target.value) })
              }
            />
          </div>
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
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.featured}
              onCheckedChange={(v) => setForm({ ...form, featured: v })}
            />
            Featured in Index panel
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={form.active}
              onCheckedChange={(v) => setForm({ ...form, active: v })}
            />
            Active
          </label>
        </div>
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
                ₹{item.pricePerSqFt}/sq.ft · {item.changePct > 0 ? "+" : ""}
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
                endpoint={`/api/admin/market-index/${item.id}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
