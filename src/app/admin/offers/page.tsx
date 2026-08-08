import { getOffers } from "@/lib/queries";
import { OfferManager } from "@/components/admin/offer-manager";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Offers" };

export default async function AdminOffersPage() {
  const offers = await getOffers();
  return (
    <div>
      <PortalPageHeader
        title="Offers"
        description="Home page promotions — copy, creatives, CTAs, and visibility."
      />
      <OfferManager initial={offers} />
    </div>
  );
}
