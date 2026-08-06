import Link from "next/link";
import { getBlogs } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Blogs" };

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();
  return (
    <div>
      <PortalPageHeader
        title="Blogs"
        description="Guides and articles shown on the site."
        actions={
          <Button asChild className="gradient-emerald text-white">
            <Link href="/admin/blogs/new">Add blog</Link>
          </Button>
        }
      />
      <div className="space-y-3">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
          >
            <div>
              <p className="font-medium">{b.title}</p>
              <p className="text-sm text-muted-foreground">
                {b.category} · {b.publishedAt}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/blogs/${b.id}`}>Edit</Link>
              </Button>
              <DeleteButton endpoint={`/api/admin/blogs/${b.id}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
