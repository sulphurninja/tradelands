import Link from "next/link";
import { SITE } from "@/lib/constants";

const columns = [
  {
    title: "Invest",
    links: [
      { href: "/agriculture-land", label: "Agriculture Land" },
      { href: "/na-villa-plot", label: "NA Villa Plot" },
      { href: "/farm-houses", label: "Farm Houses" },
      { href: "/investment-concepts", label: "Investment Concepts" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/upcoming-projects", label: "Upcoming" },
      { href: "/compare", label: "Compare" },
      { href: "/media-gallery", label: "Media Gallery" },
      { href: "/tools", label: "Investment Tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/knowledge-centre", label: "Knowledge Centre" },
      { href: "/legal-documents", label: "Legal Documents" },
      { href: "/blogs", label: "Blogs" },
      { href: "/why-invest", label: "Why Invest" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About TradeLands" },
      { href: "/contact", label: "Contact" },
      { href: "/book-site-visit", label: "Book Site Visit" },
      { href: "/login", label: "Investor Login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-border/70 bg-forest text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.35_0.08_158/0.45),transparent_55%)]" />
      <div className="container-premium section-pad relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-display text-4xl leading-none tracking-[-0.03em]">
              Trade<span className="text-gold">Lands</span>
              <span className="text-white/70">.IND</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              {SITE.tagline}
            </p>
            <div className="mt-8 space-y-2.5 text-sm leading-none text-white/75">
              <p>{SITE.phone}</p>
              <p>{SITE.email}</p>
              <p>{SITE.address}</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[0.7rem] tracking-[0.2em] text-gold uppercase">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={link.href === "/login" ? false : undefined}
                        className="inline-flex h-9 items-center text-sm leading-none text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="gold-line mt-14" />

        <div className="mt-6 flex flex-col gap-3 text-xs leading-none text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TradeLands.IND. All rights reserved.</p>
          <p className="tracking-[0.14em] uppercase">
            Agriculture · NA Plots · Farm Houses
          </p>
        </div>
      </div>
    </footer>
  );
}
