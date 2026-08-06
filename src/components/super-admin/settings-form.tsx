"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SiteConfig } from "@/lib/platform-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PortalPanel } from "@/components/portal/portal-page";

export function SettingsForm({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/super-admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      setForm(data.settings);
      toast.success("Platform settings saved");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <PortalPanel
        title="Brand & contact"
        description="Shown across the public site and investor communications."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name">
            <Input
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
            />
          </Field>
          <Field label="Domain label">
            <Input
              value={form.domain}
              onChange={(e) => set("domain", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="WhatsApp (digits)">
            <Input
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </Field>
          <Field label="Public email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Support email">
            <Input
              type="email"
              value={form.supportEmail}
              onChange={(e) => set("supportEmail", e.target.value)}
            />
          </Field>
          <Field label="Address / cities" className="sm:col-span-2">
            <Input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <Textarea
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              rows={2}
            />
          </Field>
        </div>
      </PortalPanel>

      <PortalPanel
        title="Booking & SEO"
        description="Commercial defaults and search snippets."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Booking deposit (INR)">
            <Input
              type="number"
              min={0}
              value={form.bookingDepositInr}
              onChange={(e) =>
                set("bookingDepositInr", Number(e.target.value) || 0)
              }
            />
          </Field>
          <div />
          <Field label="SEO title" className="sm:col-span-2">
            <Input
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
            />
          </Field>
          <Field label="SEO description" className="sm:col-span-2">
            <Textarea
              value={form.seoDescription}
              onChange={(e) => set("seoDescription", e.target.value)}
              rows={3}
            />
          </Field>
        </div>
      </PortalPanel>

      <PortalPanel
        title="Feature flags"
        description="Toggle public capabilities without a deploy."
      >
        <div className="space-y-4">
          <Flag
            label="Maintenance mode"
            hint="Show a soft lock notice to visitors (staff can still sign in)."
            checked={form.maintenanceMode}
            onChange={(v) => set("maintenanceMode", v)}
          />
          <Flag
            label="Allow new registrations"
            hint="When off, /register rejects new investor signups."
            checked={form.allowRegistrations}
            onChange={(v) => set("allowRegistrations", v)}
          />
          <Flag
            label="Compare tool"
            hint="Enable property comparison on the public site."
            checked={form.enableCompare}
            onChange={(v) => set("enableCompare", v)}
          />
          <Flag
            label="Wishlist"
            hint="Allow investors to save projects."
            checked={form.enableWishlist}
            onChange={(v) => set("enableWishlist", v)}
          />
          <Flag
            label="Site visit booking"
            hint="Allow public site-visit requests."
            checked={form.enableSiteVisits}
            onChange={(v) => set("enableSiteVisits", v)}
          />
        </div>
      </PortalPanel>

      <div className="flex justify-end">
        <Button
          className="gradient-emerald text-white"
          disabled={saving}
          onClick={() => void onSave()}
        >
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function Flag({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
