import { getMarketIndices } from "@/lib/queries";
import { MarketIndexManager } from "@/components/admin/market-index-manager";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Market Index" };

export default async function AdminMarketIndexPage() {
  const items = await getMarketIndices();
  return (
    <div>
      <PortalPageHeader
        title="Market Index"
        description="Snapshot ticker rows — ₹/sq.ft and % change for home Market Snapshot + Index panel."
      />
      <MarketIndexManager initial={items} />
    </div>
  );
}
