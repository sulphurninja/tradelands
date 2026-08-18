import { connectDB } from "@/lib/db";
import { LandRequirement } from "@/models/LandRequirement";
import { LIVE_MARKET_CORRIDORS } from "@/lib/market-corridors";
import { RequirementStatusSelect } from "@/components/admin/requirement-status-select";
import { DeleteButton } from "@/components/admin/delete-button";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Requirements" };

const KM_LABELS: Record<string, string> = {
  "0-5": "Within 5 km",
  "5-10": "5–10 km",
  "10-25": "10–25 km",
  "25-50": "25–50 km",
  "50-100": "50–100 km",
};

const PRICE_LABELS: Record<string, string> = {
  "under-50l": "Under ₹50L",
  "50l-1cr": "₹50L – ₹1 Cr",
  "1cr-3cr": "₹1 Cr – ₹3 Cr",
  "3cr-5cr": "₹3 Cr – ₹5 Cr",
  "5cr-plus": "₹5 Cr+",
};

function locationLabel(slug: string) {
  return (
    LIVE_MARKET_CORRIDORS.find((c) => c.slug === slug)?.name || slug
  );
}

export default async function AdminRequirementsPage() {
  await connectDB();
  const rows = await LandRequirement.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PortalPageHeader
        title="Requirements"
        description="Buyer requirement submissions from the homepage — match inventory and follow up."
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Buyer</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Distance</th>
                <th className="px-4 py-3 text-left font-medium">Acres</th>
                <th className="px-4 py-3 text-left font-medium">Budget</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Received</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const created = row.createdAt
                  ? new Date(String(row.createdAt)).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—";
                return (
                  <tr
                    key={String(row._id)}
                    className="border-t border-border align-top"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.name}</p>
                      <a
                        href={`tel:${row.phone}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {row.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {locationLabel(String(row.location))}
                    </td>
                    <td className="px-4 py-3">
                      {KM_LABELS[String(row.kmRange)] || row.kmRange}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{row.acres}</td>
                    <td className="px-4 py-3">
                      {PRICE_LABELS[String(row.priceRange)] || row.priceRange}
                    </td>
                    <td className="px-4 py-3">
                      <RequirementStatusSelect
                        id={String(row._id)}
                        status={String(row.status || "new")}
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{created}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton
                        endpoint={`/api/admin/requirements/${String(row._id)}`}
                      />
                    </td>
                  </tr>
                );
              })}
              {!rows.length ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    No requirements yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </PortalPanel>
    </div>
  );
}
