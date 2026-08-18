import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  BookOpen,
  Building2,
  CalendarDays,
  Camera,
  ClipboardList,
  CreditCard,
  FileText,
  Headphones,
  LayoutDashboard,
  LineChart,
  ListOrdered,
  MapPinned,
  MessageSquareQuote,
  PhoneCall,
  Scale,
  Settings,
  Shield,
  Sparkles,
  Tag,
  UserRound,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type PortalConfig = {
  key: "customer" | "admin" | "sales" | "superadmin";
  title: string;
  homeHref: string;
  nav: PortalNavItem[];
};

const adminCmsNav: PortalNavItem[] = [
  { href: "/admin", label: "CMS Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/market-index", label: "Market Index", icon: LineChart },
  {
    href: "/admin/market-locations",
    label: "Market Locations",
    icon: MapPinned,
  },
  { href: "/admin/waitlist", label: "Waitlist", icon: ListOrdered },
  { href: "/admin/concepts", label: "Concepts", icon: Sparkles },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/media", label: "Media & Docs", icon: Camera },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/sale-land", label: "Sell Land", icon: Scale },
  { href: "/admin/requirements", label: "Requirements", icon: ClipboardList },
  { href: "/admin/site-visits", label: "Site Visits", icon: PhoneCall },
];

export function getPortalConfig(role: UserRole): PortalConfig {
  if (role === "superadmin") {
    return {
      key: "superadmin",
      title: "Super Admin",
      homeHref: "/super-admin",
      nav: [
        {
          href: "/super-admin",
          label: "Platform overview",
          icon: Shield,
          exact: true,
        },
        { href: "/super-admin/users", label: "Users & roles", icon: Users },
        {
          href: "/super-admin/settings",
          label: "Platform settings",
          icon: Settings,
        },
        ...adminCmsNav,
        { href: "/super-admin/profile", label: "Profile", icon: UserRound },
      ],
    };
  }

  if (role === "admin") {
    return {
      key: "admin",
      title: "Admin",
      homeHref: "/admin",
      nav: [
        ...adminCmsNav,
        { href: "/admin/profile", label: "Profile", icon: UserRound },
      ],
    };
  }

  if (role === "sales") {
    return {
      key: "sales",
      title: "Agent / Channel Partner",
      homeHref: "/crm",
      nav: [
        { href: "/crm", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/crm/leads", label: "My leads", icon: Users },
        { href: "/crm/site-visits", label: "Site Visits", icon: CalendarDays },
        { href: "/crm/follow-ups", label: "Follow-ups", icon: PhoneCall },
        { href: "/crm/profile", label: "Profile", icon: UserRound },
      ],
    };
  }

  return {
    key: "customer",
    title: "Investor",
    homeHref: "/dashboard",
    nav: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/dashboard/wishlist", label: "Wishlist", icon: Bookmark },
      { href: "/dashboard/bookings", label: "Bookings", icon: FileText },
      {
        href: "/dashboard/site-visits",
        label: "Site Visits",
        icon: CalendarDays,
      },
      { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
      { href: "/dashboard/documents", label: "Documents", icon: FileText },
      { href: "/dashboard/support", label: "Support", icon: Headphones },
      { href: "/dashboard/profile", label: "Profile", icon: Settings },
    ],
  };
}

export function roleLabel(role: UserRole) {
  const map: Record<UserRole, string> = {
    customer: "Investor",
    sales: "Agent / CP",
    admin: "Admin",
    superadmin: "Super Admin",
  };
  return map[role];
}
