import { getMarketLocations } from "@/lib/queries";
import { MarketLocationManager } from "@/components/admin/market-location-manager";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Market Locations" };

export default async function AdminMarketLocationsPage() {
  const items = await getMarketLocations();
  return (
    <div>
      <PortalPageHeader
        title="Market Locations"
        description="Location path + land performance chart series (year / ₹ per sq.ft)."
      />
      <MarketLocationManager initial={items} />
    </div>
  );
}
