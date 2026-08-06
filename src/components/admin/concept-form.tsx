"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { InvestmentConcept } from "@/lib/types";
import { slugify } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "@/components/ui/form-select";
import { FileUpload } from "@/components/admin/file-upload";
import { StringListEditor } from "@/components/admin/string-list-editor";

export function ConceptForm({ concept }: { concept?: InvestmentConcept }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand: concept?.brand || "AVENZA",
    slug: concept?.slug || "",
    name: concept?.name || "",
    tagline: concept?.tagline || "",
    overview: concept?.overview || "",
    benefits: concept?.benefits || [""],
    businessModel: concept?.businessModel || "",
    investmentPlan: concept?.investmentPlan || "",
    incomeTimeline: concept?.incomeTimeline || "",
    maintenance: concept?.maintenance || "",
    expectedReturns: concept?.expectedReturns || "",
    coverImage: concept?.coverImage || "",
    gallery: concept?.gallery || [],
    faqs: concept?.faqs || [{ question: "", answer: "" }],
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        concept ? `/api/admin/concepts/${concept.id}` : "/api/admin/concepts",
        {
          method: concept ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            slug: form.slug || slugify(form.name),
            benefits: form.benefits.filter(Boolean),
            gallery: form.gallery.filter(Boolean),
            faqs: form.faqs.filter((f) => f.question.trim()),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success("Concept saved");
      router.push("/admin/concepts");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Brand</Label>
          <FormSelect
            value={form.brand}
            onValueChange={(brand) =>
              setForm((f) => ({
                ...f,
                brand: brand as InvestmentConcept["brand"],
              }))
            }
            options={["AVENZA", "ORLANE", "FLORAVE"].map((b) => ({
              value: b,
              label: b,
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: concept ? f.slug : slugify(e.target.value),
              }))
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          required
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={form.tagline}
          onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Overview</Label>
        <Textarea
          rows={3}
          value={form.overview}
          onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
        />
      </div>
      {(
        [
          "businessModel",
          "investmentPlan",
          "incomeTimeline",
          "maintenance",
          "expectedReturns",
        ] as const
      ).map((key) => (
        <div key={key} className="space-y-2">
          <Label className="capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </Label>
          <Textarea
            rows={2}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          />
        </div>
      ))}
      <div>
        <Label>Benefits</Label>
        <StringListEditor
          values={form.benefits}
          onChange={(benefits) => setForm((f) => ({ ...f, benefits }))}
        />
      </div>
      <div>
        <Label>Cover image</Label>
        <FileUpload
          value={form.coverImage}
          onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
          folder="tradelands/concepts"
        />
      </div>
      <div>
        <Label>Gallery URLs</Label>
        <StringListEditor
          values={form.gallery}
          onChange={(gallery) => setForm((f) => ({ ...f, gallery }))}
          placeholder="Image URL"
        />
      </div>
      <div className="space-y-3">
        <Label>FAQs</Label>
        {form.faqs.map((faq, i) => (
          <div key={i} className="grid gap-2 rounded-xl border p-3">
            <Input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i] = { ...faq, question: e.target.value };
                setForm((f) => ({ ...f, faqs }));
              }}
            />
            <Textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i] = { ...faq, answer: e.target.value };
                setForm((f) => ({ ...f, faqs }));
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setForm((f) => ({
              ...f,
              faqs: [...f.faqs, { question: "", answer: "" }],
            }))
          }
        >
          Add FAQ
        </Button>
      </div>
      <Button type="submit" disabled={saving} className="gradient-emerald text-white">
        {saving ? "Saving…" : "Save concept"}
      </Button>
    </form>
  );
}
