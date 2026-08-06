import Link from "next/link";
import { getAdminStats } from "@/lib/queries";
import {
  PortalPageHeader,
  PortalPanel,
  PortalStatCard,
} from "@/components/portal/portal-page";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

export default async function AdminHomePage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Projects", value: stats.projects, href: "/admin/projects" },
    { label: "Concepts", value: stats.concepts, href: "/admin/concepts" },
    { label: "Blogs", value: stats.blogs, href: "/admin/blogs" },
    { label: "Media", value: stats.media, href: "/admin/media" },
    { label: "Reviews", value: stats.reviews, href: "/admin/reviews" },
    { label: "Leads", value: stats.leads, href: "/admin/leads" },
    { label: "Site visits", value: stats.visits, href: "/admin/site-visits" },
    { label: "Users", value: stats.users, href: "/admin/profile" },
  ];

  return (
    <div>
      <PortalPageHeader
        title="Admin overview"
        description="Manage inventory, content, media, leads, and site operations."
        actions={
          <Button asChild className="gradient-emerald text-white">
            <Link href="/admin/projects/new">Add project</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="block">
            <PortalStatCard label={card.label} value={card.value} />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PortalPanel
          title="Content workspace"
          description="Publish and maintain public-facing assets."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/projects", label: "Projects CMS" },
              { href: "/admin/blogs", label: "Blog editor" },
              { href: "/admin/concepts", label: "Investment concepts" },
              { href: "/admin/media", label: "Media library" },
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
        <PortalPanel
          title="Pipeline"
          description="Sales-facing inbound activity."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/leads", label: "Lead inbox" },
              { href: "/admin/site-visits", label: "Site visit queue" },
              { href: "/admin/reviews", label: "Review moderation" },
              { href: "/crm", label: "Open CRM view" },
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
