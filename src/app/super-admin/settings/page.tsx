import { getSiteConfig } from "@/lib/platform-settings";
import { PortalPageHeader } from "@/components/portal/portal-page";
import { SettingsForm } from "@/components/super-admin/settings-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Super Admin · Settings" };

export default async function SuperAdminSettingsPage() {
  const settings = await getSiteConfig();

  return (
    <div>
      <PortalPageHeader
        title="Platform settings"
        description="Global brand, contact, booking deposit, SEO, and feature flags."
      />
      <SettingsForm initial={settings} />
    </div>
  );
}
