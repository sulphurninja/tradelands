import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { SiteVisit } from "@/models/SiteVisit";
import {
  PortalPageHeader,
  PortalPanel,
  PortalStatCard,
} from "@/components/portal/portal-page";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sales CRM" };

export default async function CrmHomePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/crm");

  await connectDB();
  const [leads, newLeads, visits, pendingVisits] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "new" }),
    SiteVisit.countDocuments(),
    SiteVisit.countDocuments({ status: "requested" }),
  ]);

  return (
    <div>
      <PortalPageHeader
        title={`Hello, ${session.name.split(" ")[0]}`}
        description="Work your lead pipeline, site visits, and follow-ups."
        actions={
          <Button asChild variant="outline">
            <Link href="/crm/leads">Open lead inbox</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard label="Total leads" value={leads} />
        <PortalStatCard label="New leads" value={newLeads} hint="Needs first contact" />
        <PortalStatCard label="Site visits" value={visits} />
        <PortalStatCard
          label="Pending visits"
          value={pendingVisits}
          hint="Awaiting confirmation"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <PortalPanel
          title="Today’s focus"
          description="Prioritize inbound demand."
          className="lg:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                href: "/crm/leads",
                label: "Qualify new leads",
                desc: "Update status and assign next steps",
              },
              {
                href: "/crm/site-visits",
                label: "Confirm visits",
                desc: "Lock dates and notify investors",
              },
              {
                href: "/crm/follow-ups",
                label: "Run follow-ups",
                desc: "Call contacted and qualified leads",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="font-medium">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </PortalPanel>
        <PortalPanel title="Workspace">
          <p className="text-sm text-muted-foreground">
            Signed in as {session.email}. Pipeline tools stay inside this CRM
            shell — separate from the public marketing site.
          </p>
        </PortalPanel>
      </div>
    </div>
  );
}
