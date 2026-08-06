import type { UserRole } from "@/lib/types";
import { roleLabel } from "@/lib/portal-nav";
import { PortalPageHeader, PortalPanel } from "@/components/portal/portal-page";

export function ProfilePanel({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: UserRole;
}) {
  return (
    <div>
      <PortalPageHeader
        title="Profile"
        description="Your account details and workspace access."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PortalPanel title="Account">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Full name</dt>
              <dd className="mt-1 font-medium">{name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="mt-1 font-medium">{roleLabel(role)}</dd>
            </div>
          </dl>
        </PortalPanel>
        <PortalPanel
          title="Security"
          description="Password and session controls."
        >
          <p className="text-sm text-muted-foreground">
            You are signed in with a secure JWT cookie session. Sign out from
            the profile menu when finished.
          </p>
        </PortalPanel>
      </div>
    </div>
  );
}
