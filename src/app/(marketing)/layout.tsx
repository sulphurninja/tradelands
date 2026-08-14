import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MaintenanceBanner } from "@/components/layout/maintenance-banner";
import { SocialProofToasts } from "@/components/marketing/social-proof-toasts";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects().catch(() => []);
  const proofProjects = projects.slice(0, 12).map((p) => ({
    name: p.name,
    slug: p.slug,
    location: [
      p.location.village || p.location.taluka,
      p.location.district,
    ]
      .filter(Boolean)
      .join(", "),
    coverImage: p.coverImage,
  }));

  return (
    <div className="flex min-h-full flex-col overflow-x-clip">
      <MaintenanceBanner />
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
      <SocialProofToasts projects={proofProjects} />
    </div>
  );
}
