import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ProfilePanel } from "@/components/portal/profile-panel";

export const metadata = { title: "Super Admin · Profile" };

export default async function SuperAdminProfilePage() {
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
