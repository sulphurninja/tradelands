import { getWaitlistEntries } from "@/lib/queries";
import { WaitlistManager } from "@/components/admin/waitlist-manager";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Waitlist" };

export default async function AdminWaitlistPage() {
  const items = await getWaitlistEntries();
  return (
    <div>
      <PortalPageHeader
        title="Coming Soon waitlist"
        description="Investors who joined early access for upcoming land drops."
      />
      <WaitlistManager initial={items} />
    </div>
  );
}
