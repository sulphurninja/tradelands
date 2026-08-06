import { connectDB } from "@/lib/db";
import { SiteVisit } from "@/models/SiteVisit";
import { VisitStatusSelect } from "@/components/admin/visit-status-select";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Site Visits" };

export default async function AdminSiteVisitsPage() {
  await connectDB();
  const visits = await SiteVisit.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PortalPageHeader
        title="Site visits"
        description="Scheduled visits from the booking form."
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Guest</th>
                <th className="px-4 py-3 text-left font-medium">Project</th>
                <th className="px-4 py-3 text-left font-medium">When</th>
                <th className="px-4 py-3 text-left font-medium">Pickup</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={String(v._id)} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.phone}</p>
                  </td>
                  <td className="px-4 py-3">{v.projectSlug}</td>
                  <td className="px-4 py-3">
                    {v.date} · {v.time}
                  </td>
                  <td className="px-4 py-3">
                    {v.pickupRequired ? v.pickupAddress || "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <VisitStatusSelect
                      id={String(v._id)}
                      status={String(v.status || "requested")}
                    />
                  </td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No site visits yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PortalPanel>
    </div>
  );
}
