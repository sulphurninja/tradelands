import { getReviews } from "@/lib/queries";
import { ReviewManager } from "@/components/admin/review-manager";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return (
    <div>
      <PortalPageHeader
        title="Reviews"
        description="Customer quotes shown on the home page."
      />
      <ReviewManager initial={reviews} />
    </div>
  );
}
