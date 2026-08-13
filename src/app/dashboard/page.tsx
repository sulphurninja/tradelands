import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CalendarDays, FileText, Heart, Home } from "lucide-react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SiteVisit } from "@/models/SiteVisit";
import { Booking } from "@/models/Booking";
import { User } from "@/models/User";
import {
  PortalPageHeader,
  PortalPanel,
  PortalStatCard,
} from "@/components/portal/portal-page";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Investor Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  await connectDB();
  const user = await User.findById(session.sub).select("wishlist").lean();
  const wishlistCount = user?.wishlist?.length || 0;

  const [visits, bookings] = await Promise.all([
    SiteVisit.countDocuments({
      $or: [{ userId: session.sub }, { email: session.email }],
    }),
    Booking.countDocuments({ userId: session.sub }),
  ]);

  const quick = [
    {
      href: "/",
      label: "Home / Public site",
      desc: "Back to the marketing homepage",
    },
    {
      href: "/projects",
      label: "Browse projects",
      desc: "Explore agriculture land and NA plots",
    },
    {
      href: "/book-site-visit",
      label: "Book a site visit",
      desc: "Pick a date and project",
    },
  ];

  return (
    <div>
      <PortalPageHeader
        title={`Welcome, ${session.name.split(" ")[0]}`}
        description="Track visits, bookings, payments, and saved projects."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="size-4" />
                Home
              </Link>
            </Button>
            <Button asChild className="gradient-emerald text-white dark:text-white">
              <Link href="/book-site-visit">
                Book site visit
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard label="Site visits" value={visits} hint="Requested / booked" />
        <PortalStatCard label="Bookings" value={bookings} hint="Plot reservations" />
        <PortalStatCard
          label="Wishlist"
          value={wishlistCount}
          hint="Saved projects"
        />
        <PortalStatCard label="Open tickets" value={0} hint="Support" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <PortalPanel
          title="Quick actions"
          description="Common investor tasks"
          className="lg:col-span-2"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {quick.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="font-medium">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </PortalPanel>

        <PortalPanel title="Shortcuts">
          <div className="space-y-2">
            {[
              { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
              {
                href: "/dashboard/site-visits",
                label: "Site visits",
                icon: CalendarDays,
              },
              {
                href: "/dashboard/bookings",
                label: "Bookings",
                icon: FileText,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted"
              >
                <item.icon className="size-4 text-primary" />
                {item.label}
              </Link>
            ))}
          </div>
        </PortalPanel>
      </div>
    </div>
  );
}
