import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { agentLeadFilter, agentVisitFilter } from "@/lib/agent-scope";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { SiteVisit } from "@/models/SiteVisit";
import { User } from "@/models/User";
import {
  PortalPageHeader,
  PortalPanel,
  PortalStatCard,
} from "@/components/portal/portal-page";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agent / Channel Partner" };

export default async function CrmHomePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/crm");

  await connectDB();
  const leadFilter = agentLeadFilter(session);
  const visitFilter = agentVisitFilter(session);
  const agent = await User.findById(session.sub).select("referralCode").lean();

  const [leads, newLeads, visits, pendingVisits] = await Promise.all([
    Lead.countDocuments(leadFilter),
    Lead.countDocuments({ ...leadFilter, status: "new" }),
    SiteVisit.countDocuments(visitFilter),
    SiteVisit.countDocuments({ ...visitFilter, status: "requested" }),
  ]);

  return (
    <div>
      <PortalPageHeader
        title={`Hello, ${session.name.split(" ")[0]}`}
        description="Agent / Channel Partner desk — your leads, visits, and follow-ups."
        actions={
          <Button asChild variant="outline">
            <Link href="/crm/leads">Open my leads</Link>
          </Button>
        }
      />

      {agent?.referralCode ? (
        <p className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm">
          Your referral code:{" "}
          <span className="font-semibold tracking-wide">
            {agent.referralCode}
          </span>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard label="My leads" value={leads} />
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
                label: "Qualify my leads",
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
            Signed in as {session.email}. Share your referral code on site-visit
            and enquiry forms to attribute demand to you.
          </p>
          <Button asChild className="mt-4 w-full" variant="outline">
            <Link href="/">Home / Public site</Link>
          </Button>
        </PortalPanel>
      </div>
    </div>
  );
}
