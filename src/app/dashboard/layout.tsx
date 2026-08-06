import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppShell } from "@/components/portal/app-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  if (session.role === "superadmin") {
    redirect("/super-admin");
  }
  if (session.role === "admin") {
    redirect("/admin");
  }
  if (session.role === "sales") {
    redirect("/crm");
  }

  return (
    <AppShell
      user={{
        name: session.name,
        email: session.email,
        role: session.role,
      }}
    >
      {children}
    </AppShell>
  );
}
