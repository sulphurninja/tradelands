import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getProjects } from "@/lib/queries";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ project?: string }>;
}

export const metadata = {
  title: "Online Booking",
};

export default async function BookingPage({ searchParams }: Props) {
  const { project: slug } = await searchParams;
  const projects = await getProjects();
  const project =
    (slug ? await getProjectBySlug(slug) : null) || projects[0];

  if (!project) {
    return (
      <PageHero
        eyebrow="Online Booking"
        title="No projects available"
        description="Please check back shortly."
        compact
      />
    );
  }

  const available = project.plots.filter((p) => p.status === "available");

  return (
    <>
      <PageHero
        eyebrow="Online Booking"
        title="Reserve your plot"
        description="Choose a plot, complete KYC, accept the agreement, and pay the booking amount."
        compact
      />
      <section className="container-premium section-pad pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-10">
          <p className="text-[0.7rem] tracking-[0.2em] text-primary uppercase">
            Selected project
          </p>
          <h2 className="font-display mt-2 text-3xl">{project.name}</h2>
          <p className="mt-2 text-muted-foreground">
            Booking amount from{" "}
            {project.pricing.bookingAmount
              ? formatINR(project.pricing.bookingAmount)
              : "on request"}
          </p>

          <div className="mt-8 space-y-3">
            <p className="text-sm font-medium">Available plots</p>
            {available.map((plot) => (
              <div
                key={plot.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
              >
                <div>
                  <p className="font-medium leading-none">{plot.number}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {plot.areaGuntha} Guntha · {formatINR(plot.price)}
                  </p>
                </div>
                <Button asChild size="sm" className="gradient-emerald text-white">
                  <Link href="/register">Continue to KYC</Link>
                </Button>
              </div>
            ))}
          </div>

          <ol className="mt-10 space-y-3 text-sm text-muted-foreground">
            <li>1. Aadhaar & PAN upload</li>
            <li>2. Agreement acceptance</li>
            <li>3. Payment</li>
            <li>4. Confirmation & receipt</li>
          </ol>
        </div>
      </section>
    </>
  );
}
