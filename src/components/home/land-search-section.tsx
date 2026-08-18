import Link from "next/link";
import { PropertySearch } from "@/components/home/property-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandSearchSection({
  className,
  initial,
  trending = [],
}: {
  className?: string;
  initial?: {
    state?: string;
    category?: string;
    budget?: string;
  };
  trending?: { slug: string; name: string; locationLabel?: string }[];
}) {
  return (
    <section className={cn("container-premium section-pad py-10 sm:py-12", className)}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Find your land
        </p>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-foreground sm:text-[32px]">
          Search projects across India.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-4xl">
        <PropertySearch initial={initial} trending={trending} />
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          asChild
          className="h-11 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/market">Browse all projects</Link>
        </Button>
      </div>
    </section>
  );
}
