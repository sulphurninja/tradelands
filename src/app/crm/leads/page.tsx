import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "CRM · Leads" };

export default async function CrmLeadsPage() {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PortalPageHeader
        title="Leads"
        description="Inbound enquiries ready for qualification."
      />
      <PortalPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Interest</th>
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
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No leads yet.
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
