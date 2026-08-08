"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/types";
import { slugify } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/admin/file-upload";

export function BlogForm({ blog }: { blog?: BlogPost }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    body: blog?.body || "",
    coverImage: blog?.coverImage || "",
    category: blog?.category || "Guides",
    author: blog?.author || "TradeLands Desk",
    publishedAt: blog?.publishedAt || new Date().toISOString().slice(0, 10),
    readTime: blog?.readTime || "5 min",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title) };
    try {
      const res = await fetch(
        blog ? `/api/admin/blogs/${blog.id}` : "/api/admin/blogs",
        {
          method: blog ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success("Blog saved");
      router.push("/admin/blogs");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-5">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          required
          value={form.title}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              title: e.target.value,
              slug: blog ? f.slug : slugify(e.target.value),
            }))
          }
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Author</Label>
          <Input
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Published</Label>
          <Input
            type="date"
            value={form.publishedAt}
            onChange={(e) =>
              setForm((f) => ({ ...f, publishedAt: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Read time</Label>
          <Input
            value={form.readTime}
            onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Excerpt</Label>
        <Textarea
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <Textarea
          rows={8}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        />
      </div>
      <div>
        <Label>Cover image</Label>
        <FileUpload
          value={form.coverImage}
          onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
          folder="tradelands/blogs"
        />
      </div>
      <Button type="submit" disabled={saving} className="gradient-emerald text-white dark:text-white">
        {saving ? "Saving…" : "Save blog"}
      </Button>
    </form>
  );
}
