import Link from "next/link";
import { getProjects } from "@/lib/queries";
import { formatINR, categoryLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin · Projects" };

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <PortalPageHeader
        title="Projects"
        description="Full project details, plots, docs, and media."
        actions={
          <Button asChild className="gradient-emerald text-white dark:text-white">
            <Link href="/admin/projects/new">Add project</Link>
          </Button>
        }
      />

      <PortalPanel>
      <div className="overflow-x-auto -m-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-border/70">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{categoryLabel(p.category)}</td>
                <td className="px-4 py-3">
                  {p.location.village}, {p.location.district}
                </td>
                <td className="px-4 py-3">{formatINR(p.pricing.minPrice)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/projects/${p.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton
                      endpoint={`/api/admin/projects/${p.id}`}
                      label="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </PortalPanel>
    </div>
  );
}
