import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

const sections: Record<string, { title: string; body: string }> = {
  wishlist: {
    title: "Wishlist",
    body: "Projects you save will appear here for quick comparison and follow-up.",
  },
  bookings: {
    title: "Bookings",
    body: "Plot reservations, payment status, and booking receipts.",
  },
  "site-visits": {
    title: "Site Visits",
    body: "Upcoming and completed site visits with confirmation status.",
  },
  payments: {
    title: "Payments",
    body: "Booking amounts, dues, and downloadable receipts.",
  },
  documents: {
    title: "Documents",
    body: "Aadhaar, PAN, agreements, and project downloads linked to your account.",
  },
  support: {
    title: "Support",
    body: "Raise tickets with the investment desk and track responses.",
  },
  offers: {
    title: "Offers",
    body: "Launch offers and coupons for your account.",
  },
  referral: {
    title: "Referral Programme",
    body: "Invite investors and track referral rewards.",
  },
  profile: {
    title: "Profile",
    body: "Managed on the dedicated profile page.",
  },
};

interface Props {
  params: Promise<{ section: string }>;
}

export default async function DashboardSectionPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { section } = await params;
  if (section === "profile") {
    redirect("/dashboard/profile");
  }

  const data = sections[section];
  if (!data) notFound();

  return (
    <div>
      <PortalPageHeader title={data.title} description={data.body} />
      <PortalPanel>
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No records yet. Activity will show here as you book visits and plots.
        </div>
      </PortalPanel>
    </div>
  );
}
