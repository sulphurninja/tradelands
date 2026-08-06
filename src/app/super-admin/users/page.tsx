import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeUser } from "@/lib/users";
import { User } from "@/models/User";
import { PortalPageHeader } from "@/components/portal/portal-page";
import { UsersManager } from "@/components/super-admin/users-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Super Admin · Users" };

export default async function SuperAdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const docs = await User.find().sort({ createdAt: -1 }).lean();
  const users = docs.map((d) => serializeUser(d as never));

  return (
    <div>
      <PortalPageHeader
        title="Users & roles"
        description="Create staff accounts, change roles, reset passwords, and deactivate access."
      />
      <UsersManager initial={users} currentUserId={session.sub} />
    </div>
  );
}
