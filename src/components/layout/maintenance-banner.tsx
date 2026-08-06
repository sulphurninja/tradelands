import { getSiteConfig } from "@/lib/platform-settings";

export async function MaintenanceBanner() {
  const site = await getSiteConfig();
  if (!site.maintenanceMode) return null;

  return (
    <div className="relative z-[60] bg-amber-600 px-4 py-2.5 text-center text-sm text-white">
      {site.siteName} is under maintenance. Some features may be unavailable.
      Contact {site.supportEmail} for urgent help.
    </div>
  );
}
