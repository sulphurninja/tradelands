import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  compact?: boolean;
  actions?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  compact,
  actions,
  crumbs,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-x-clip bg-background",
        compact ? "pt-24 pb-10 lg:pt-28 lg:pb-14" : "pt-28 pb-14 lg:pt-32 lg:pb-20"
      )}
    >
      {image ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-black/55" />
        </>
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      <div
        className={cn(
          "container-premium section-pad relative text-center",
          image && "text-white"
        )}
      >
        {crumbs && (
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-[12px] text-muted-foreground">
            <Link href="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.href} className="contents">
                <span>/</span>
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </div>
        )}
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-[12px] font-medium tracking-[0.08em] uppercase",
              image ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "mx-auto max-w-4xl px-1 text-balance break-words font-semibold tracking-[-0.03em]",
            compact
              ? "text-[1.75rem] sm:text-[2.75rem]"
              : "text-[2rem] sm:text-[3.5rem] lg:text-[4rem]"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mx-auto mt-4 max-w-2xl px-1 text-[15px] leading-relaxed break-words sm:text-[19px]",
              image ? "text-white/75" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
        {actions && (
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
