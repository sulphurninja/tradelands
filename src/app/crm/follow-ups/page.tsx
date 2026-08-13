import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { agentLeadFilter } from "@/lib/agent-scope";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agent · Follow-ups" };

export default async function CrmFollowUpsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/crm/follow-ups");

  await connectDB();
  const leads = await Lead.find({
    ...agentLeadFilter(session),
    status: { $in: ["contacted", "qualified", "site-visit"] },
  })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div>
      <PortalPageHeader
        title="Follow-ups"
        description="Leads already in motion that need another touch."
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={String(lead._id)} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect
                      id={String(lead._id)}
                      status={String(lead.status || "new")}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.updatedAt
                      ? new Date(lead.updatedAt).toLocaleString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No active follow-ups. Move leads out of “new” to see them
                    here.
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
