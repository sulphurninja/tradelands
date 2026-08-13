import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { agentLeadFilter } from "@/lib/agent-scope";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agent · My leads" };

export default async function CrmLeadsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/crm/leads");

  await connectDB();
  const leads = await Lead.find(agentLeadFilter(session))
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <PortalPageHeader
        title={session.role === "sales" ? "My leads" : "Leads"}
        description={
          session.role === "sales"
            ? "Leads tagged with your referral code or assignment."
            : "Inbound enquiries ready for qualification."
        }
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Interest</th>
                <th className="px-4 py-3 text-left font-medium">Referral</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Message</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={String(lead._id)} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.email || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">
                    {lead.interest || lead.projectSlug || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {lead.referralCode || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect
                      id={String(lead._id)}
                      status={String(lead.status || "new")}
                    />
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {lead.message || "—"}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No leads in your queue yet.
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
