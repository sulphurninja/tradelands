import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { agentVisitFilter } from "@/lib/agent-scope";
import { connectDB } from "@/lib/db";
import { SiteVisit } from "@/models/SiteVisit";
import { VisitStatusSelect } from "@/components/admin/visit-status-select";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agent · Site Visits" };

export default async function CrmSiteVisitsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/crm/site-visits");

  await connectDB();
  const visits = await SiteVisit.find(agentVisitFilter(session))
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <PortalPageHeader
        title="Site visits"
        description={
          session.role === "sales"
            ? "Visits attributed to your referral or booking."
            : "Confirm schedules and keep investors moving."
        }
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Investor</th>
                <th className="px-4 py-3 text-left font-medium">Project</th>
                <th className="px-4 py-3 text-left font-medium">When</th>
                <th className="px-4 py-3 text-left font-medium">Pickup</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={String(visit._id)} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{visit.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {visit.phone}
                      {visit.email ? ` · ${visit.email}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">{visit.projectSlug || "—"}</td>
                  <td className="px-4 py-3">
                    {visit.date} · {visit.time}
                  </td>
                  <td className="px-4 py-3">
                    {visit.pickupRequired
                      ? visit.pickupAddress || "Yes"
                      : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <VisitStatusSelect
                      id={String(visit._id)}
                      status={String(visit.status || "requested")}
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
