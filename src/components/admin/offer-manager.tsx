"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Offer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/admin/file-upload";
import { DeleteButton } from "@/components/admin/delete-button";

const emptyForm = {
  eyebrow: "Limited offer",
  title: "",
  description: "",
  image: "",
  badge: "",
  highlights: "",
  ctaLabel: "Explore offer",
  ctaHref: "/market",
  active: true,
  sortOrder: 0,
  validUntil: "",
};

export function OfferManager({ initial }: { initial: Offer[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function loadEdit(offer: Offer) {
    setEditingId(offer.id);
    setForm({
      eyebrow: offer.eyebrow,
      title: offer.title,
      description: offer.description,
      image: offer.image,
      badge: offer.badge,
      highlights: offer.highlights.join("\n"),
      ctaLabel: offer.ctaLabel,
      ctaHref: offer.ctaHref,
      active: offer.active,
      sortOrder: offer.sortOrder,
      validUntil: offer.validUntil,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        sortOrder: Number(form.sortOrder) || 0,
      };
      const res = await fetch(
        editingId ? `/api/admin/offers/${editingId}` : "/api/admin/offers",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save offer");
        return;
      }
      if (editingId) {
        setItems((prev) =>
          prev.map((o) => (o.id === editingId ? data.offer : o))
        );
        toast.success("Offer updated");
      } else {
        setItems((prev) => [data.offer, ...prev]);
        toast.success("Offer added");
      }
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(offer: Offer) {
    const res = await fetch(`/api/admin/offers/${offer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !offer.active }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed");
      return;
    }
    setItems((prev) => prev.map((o) => (o.id === offer.id ? data.offer : o)));
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl">
            {editingId ? "Edit offer" : "Add offer"}
          </h2>
          {editingId ? (
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input
              value={form.eyebrow}
              onChange={(e) =>
                setForm((f) => ({ ...f, eyebrow: e.target.value }))
              }
              placeholder="Limited offer"
            />
          </div>
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder="Early bird"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Mulshi plantation launch offer"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Image / creative</Label>
          <FileUpload
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            folder="tradelands/offers"
            accept="image/*,video/*"
            label="Upload offer asset"
          />
        </div>

        <div className="space-y-2">
          <Label>Highlights (one per line)</Label>
          <Textarea
            rows={3}
            value={form.highlights}
            onChange={(e) =>
              setForm((f) => ({ ...f, highlights: e.target.value }))
            }
            placeholder={"Free site visit\nFlexible booking amount"}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA label</Label>
            <Input
              value={form.ctaLabel}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaLabel: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>CTA link</Label>
            <Input
              value={form.ctaHref}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaHref: e.target.value }))
              }
              placeholder="/projects/..."
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Valid until</Label>
            <Input
              value={form.validUntil}
              onChange={(e) =>
                setForm((f) => ({ ...f, validUntil: e.target.value }))
              }
              placeholder="31 Aug 2026"
            />
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  sortOrder: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border px-3 py-2.5">
          <div>
            <p className="text-sm font-medium">Active on home</p>
            <p className="text-xs text-muted-foreground">
              Inactive offers stay in admin only.
            </p>
          </div>
          <Switch
            checked={form.active}
            onCheckedChange={(active) => setForm((f) => ({ ...f, active }))}
          />
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="gradient-emerald text-white dark:text-white"
        >
          {saving ? "Saving…" : editingId ? "Update offer" : "Add offer"}
        </Button>
      </form>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No offers yet. Add one to show on the home page.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border p-4">
              <div className="flex items-start gap-3">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="size-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="size-16 shrink-0 rounded-lg bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.title}</p>
                    {item.badge ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                        {item.badge}
                      </span>
                    ) : null}
                    {!item.active ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        Hidden
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => loadEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(item)}
                    >
                      {item.active ? "Hide" : "Show"}
                    </Button>
                    <DeleteButton endpoint={`/api/admin/offers/${item.id}`} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
