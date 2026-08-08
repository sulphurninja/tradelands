"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MediaItem } from "@/lib/serialize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/ui/form-select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/admin/file-upload";
import { DeleteButton } from "@/components/admin/delete-button";

const empty = {
  title: "",
  url: "",
  publicId: "",
  type: "image",
  category: "gallery",
  alt: "",
  projectSlug: "",
  featured: false,
  sortOrder: 0,
};

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(initial), [initial]);

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url || !form.title) {
      toast.error("Title and file/URL required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed");
        return;
      }
      setItems((prev) => [data.media, ...prev]);
      setForm(empty);
      toast.success("Media added");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        onSubmit={createItem}
        className="space-y-4 rounded-2xl border border-border p-5"
      >
        <h2 className="font-display text-xl">Add media / document</h2>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <FormSelect
              value={form.type}
              onValueChange={(type) => setForm((f) => ({ ...f, type }))}
              options={[
                "image",
                "video",
                "document",
                "drone",
                "other",
              ].map((t) => ({ value: t, label: t }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <FormSelect
              value={form.category}
              onValueChange={(category) => setForm((f) => ({ ...f, category }))}
              options={[
                "gallery",
                "project",
                "blog",
                "concept",
                "legal",
                "brochure",
                "press",
                "event",
                "construction",
                "other",
              ].map((t) => ({ value: t, label: t }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Alt / caption</Label>
          <Input
            value={form.alt}
            onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Project slug (optional)</Label>
          <Input
            value={form.projectSlug}
            onChange={(e) =>
              setForm((f) => ({ ...f, projectSlug: e.target.value }))
            }
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={form.featured}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, featured: Boolean(v) }))
            }
          />
          Show in media gallery
        </label>
        <FileUpload
          value={form.url}
          folder="tradelands/media"
          accept="image/*,video/*,application/pdf"
          onChange={(url, meta) =>
            setForm((f) => ({
              ...f,
              url,
              publicId: meta?.publicId || f.publicId,
            }))
          }
        />
        <Button
          type="submit"
          disabled={saving}
          className="gradient-emerald text-white dark:text-white"
        >
          {saving ? "Saving…" : "Add to library"}
        </Button>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-xl border border-border p-3"
          >
            <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.type === "video" ||
              item.type === "drone" ||
              /\.(mp4|webm|mov)(\?|$)/i.test(item.url) ? (
                <video
                  src={item.url}
                  className="size-full object-cover"
                  muted
                  playsInline
                />
              ) : item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-[10px] uppercase text-muted-foreground">
                  {item.type}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.category} · {item.type}
                {item.featured ? " · gallery" : ""}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-xs text-primary"
              >
                {item.url}
              </a>
            </div>
            <DeleteButton
              endpoint={`/api/admin/media/${item.id}`}
              label="Remove"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
