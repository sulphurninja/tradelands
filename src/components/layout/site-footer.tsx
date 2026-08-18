import Link from "next/link";
import { SITE } from "@/lib/constants";
import { SiteLogo } from "@/components/brand/site-logo";
import { getSession } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

function portalHome(role: UserRole) {
  switch (role) {
    case "superadmin":
      return "/super-admin";
    case "admin":
      return "/admin";
    case "sales":
      return "/crm";
    default:
      return "/dashboard";
  }
}

function portalLabel(role: UserRole) {
  switch (role) {
    case "superadmin":
      return "Console";
    case "admin":
      return "Admin";
    case "sales":
      return "CRM";
    default:
      return "My Dashboard";
  }
}

export async function SiteFooter() {
  const session = await getSession();

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
      title: "Platform",
      links: [
        { href: "/market", label: "Projects" },
        { href: "/market?bulk=1", label: "Bulk deals" },
        { href: "/discover", label: "Discover" },
        { href: "/map", label: "Map" },
        { href: "/upcoming-projects", label: "Coming Soon" },
        { href: "/media-gallery", label: "Media Gallery" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/knowledge-centre", label: "Knowledge Centre" },
        { href: "/legal-documents", label: "Legal Documents" },
        { href: "/blogs", label: "Insights" },
        { href: "/why-invest", label: "Why Invest" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About TradeLands" },
        { href: "/contact", label: "Contact" },
        { href: "/book-site-visit", label: "Book Site Visit" },
        session
          ? {
              href: portalHome(session.role),
              label: portalLabel(session.role),
            }
          : { href: "/login", label: "Investor Login" },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto bg-black text-[#f5f5f7]">
      <div className="mx-auto max-w-[980px] px-5 py-12 sm:px-8 lg:max-w-[1060px] lg:px-12 xl:max-w-[1120px]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <SiteLogo onDark />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[#a1a1a6]">
              {SITE.tagline}
            </p>
            <div className="mt-6 space-y-2 text-[13px] text-[#a1a1a6]">
              <p>{SITE.phone}</p>
              <p>{SITE.email}</p>
              <p>{SITE.address}</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-semibold text-[#f5f5f7]">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={link.href === "/login" ? false : undefined}
                        className="text-[12px] text-[#a1a1a6] transition-colors hover:text-white"
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

        <div className="mt-10 border-t border-white/10 pt-5 text-[11px] text-[#6e6e73]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Copyright © {new Date().getFullYear()} TradeLands.IND. All rights
              reserved.
            </p>
            <p>Agriculture · NA Plots · Farm Houses</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
