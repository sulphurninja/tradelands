import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MaintenanceBanner } from "@/components/layout/maintenance-banner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <MaintenanceBanner />
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
    </div>
  );
}
