import Link from "next/link";
import { getConcepts } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { PortalPageHeader } from "@/components/portal/portal-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Concepts" };

export default async function AdminConceptsPage() {
  const concepts = await getConcepts();
  return (
    <div>
      <PortalPageHeader
        title="Investment concepts"
        description="AVENZA, ORLANE, FLORAVE and any new brands."
        actions={
          <Button asChild className="gradient-emerald text-white dark:text-white">
            <Link href="/admin/concepts/new">Add concept</Link>
          </Button>
        }
      />
      <div className="space-y-3">
        {concepts.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
          >
            <div>
              <p className="font-medium">
                {c.brand} · {c.name}
              </p>
              <p className="text-sm text-muted-foreground">{c.tagline}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/concepts/${c.id}`}>Edit</Link>
              </Button>
              <DeleteButton endpoint={`/api/admin/concepts/${c.id}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
