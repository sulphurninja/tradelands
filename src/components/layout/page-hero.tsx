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
        "relative overflow-x-clip",
        compact ? "pt-28 pb-12 lg:pt-32 lg:pb-16" : "pt-32 pb-16 lg:pt-40 lg:pb-24"
      )}
    >
      {image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/85 via-forest/70 to-background" />
        </>
      )}
      {!image && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.9_0.05_155/0.7),transparent_50%)]" />
      )}

      <div
        className={cn(
          "container-premium section-pad relative",
          image && "text-white"
        )}
      >
        {crumbs && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs tracking-wide uppercase opacity-70">
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
              "mb-4 text-[0.7rem] tracking-[0.28em] uppercase",
              image ? "text-gold" : "text-primary"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "font-display max-w-4xl text-balance",
            compact
              ? "text-4xl sm:text-5xl"
              : "text-5xl sm:text-6xl lg:text-7xl"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-relaxed sm:text-lg",
              image ? "text-white/75" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
