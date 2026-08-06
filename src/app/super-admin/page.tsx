import Link from "next/link";
import { connectDB } from "@/lib/db";
import { getSiteConfig } from "@/lib/platform-settings";
import { User } from "@/models/User";
import { Lead } from "@/models/Lead";
import { ProjectModel } from "@/models/Project";
import {
  PortalPageHeader,
  PortalPanel,
  PortalStatCard,
} from "@/components/portal/portal-page";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/lib/portal-nav";
import type { UserRole } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Super Admin" };

export default async function SuperAdminHomePage() {
  await connectDB();
  const [site, totalUsers, roleCounts, leads, projects] = await Promise.all([
    getSiteConfig(),
    User.countDocuments(),
    User.aggregate<{ _id: UserRole; count: number }>([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
    Lead.countDocuments(),
    ProjectModel.countDocuments(),
  ]);

  const byRole = Object.fromEntries(
    roleCounts.map((r) => [r._id, r.count])
  ) as Partial<Record<UserRole, number>>;

  return (
    <div>
      <PortalPageHeader
        title="Platform overview"
        description="User access, roles, and global TradeLands settings."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/super-admin/users">Manage users</Link>
            </Button>
            <Button asChild className="gradient-emerald text-white">
              <Link href="/super-admin/settings">Platform settings</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard label="Total users" value={totalUsers} />
        <PortalStatCard
          label="Active projects"
          value={projects}
          hint="Inventory in CMS"
        />
        <PortalStatCard label="Leads" value={leads} hint="Inbound pipeline" />
        <PortalStatCard
          label="Maintenance"
          value={site.maintenanceMode ? "On" : "Off"}
          hint={site.allowRegistrations ? "Registrations open" : "Registrations closed"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PortalPanel title="Users by role" description="Access distribution">
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              ["superadmin", "admin", "sales", "customer"] as UserRole[]
            ).map((role) => (
              <div
                key={role}
                className="rounded-xl border border-border px-4 py-3"
              >
                <p className="text-sm text-muted-foreground">{roleLabel(role)}</p>
                <p className="font-display mt-1 text-2xl">{byRole[role] ?? 0}</p>
              </div>
            ))}
          </div>
        </PortalPanel>

        <PortalPanel
          title="Quick links"
          description="Platform and content workspaces"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/super-admin/users", label: "Create / edit users" },
              { href: "/super-admin/settings", label: "Contact & feature flags" },
              { href: "/admin/projects", label: "Projects CMS" },
              { href: "/crm", label: "Sales CRM" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </PortalPanel>
      </div>
    </div>
  );
}
