import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ProfilePanel } from "@/components/portal/profile-panel";

export const metadata = { title: "Profile" };

export default async function DashboardProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <ProfilePanel
      name={session.name}
      email={session.email}
      role={session.role}
    />
  );
}
