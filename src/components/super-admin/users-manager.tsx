"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types";
import type { PublicUser } from "@/lib/users";
import { roleLabel } from "@/lib/portal-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/ui/form-select";
import { Switch } from "@/components/ui/switch";
import { PortalPanel } from "@/components/portal/portal-page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const roleOptions = (
  ["customer", "sales", "admin", "superadmin"] as UserRole[]
).map((role) => ({ value: role, label: roleLabel(role) }));

export function UsersManager({
  initial,
  currentUserId,
}: {
  initial: PublicUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer" as UserRole,
  });

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q.trim()) return true;
      const hay = `${u.name} ${u.email} ${u.phone ?? ""}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [users, q, roleFilter]);

  async function createUser() {
    setSaving(true);
    try {
      const res = await fetch("/api/super-admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Create failed");
        return;
      }
      setUsers((prev) => [data.user, ...prev]);
      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "customer",
      });
      toast.success("User created");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function patchUser(
    id: string,
    patch: Partial<{
      role: UserRole;
      active: boolean;
      password: string;
      name: string;
      phone: string;
    }>
  ) {
    const res = await fetch(`/api/super-admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Update failed");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
    toast.success("User updated");
    router.refresh();
  }

  async function removeUser(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    const res = await fetch(`/api/super-admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search name, email, phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="sm:max-w-xs"
        />
        <FormSelect
          value={roleFilter}
          onValueChange={setRoleFilter}
          options={[{ value: "all", label: "All roles" }, ...roleOptions]}
          triggerClassName="w-full sm:w-44"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground sm:ml-auto"
          >
            Add user
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create user</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="nu-name">Full name</Label>
                <Input
                  id="nu-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nu-email">Email</Label>
                <Input
                  id="nu-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nu-phone">Phone</Label>
                <Input
                  id="nu-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nu-pass">Temporary password</Label>
                <Input
                  id="nu-pass"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <FormSelect
                  value={form.role}
                  onValueChange={(v) =>
                    setForm({ ...form, role: v as UserRole })
                  }
                  options={roleOptions}
                />
              </div>
              <Button
                className="w-full gradient-emerald text-white"
                disabled={saving}
                onClick={() => void createUser()}
              >
                {saving ? "Creating…" : "Create user"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <PortalPanel>
        <div className="overflow-x-auto -m-5">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Active</th>
                <th className="px-4 py-3 text-left font-medium">Reset password</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {user.name}
                      {user.id === currentUserId ? (
                        <span className="ml-2 text-xs text-primary">(you)</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.phone ? (
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <FormSelect
                      value={user.role}
                      onValueChange={(role) =>
                        void patchUser(user.id, { role: role as UserRole })
                      }
                      options={roleOptions}
                      triggerClassName="w-40"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.active}
                        onCheckedChange={(active) =>
                          void patchUser(user.id, { active })
                        }
                        disabled={user.id === currentUserId}
                      />
                      <span className="text-xs text-muted-foreground">
                        {user.active ? "Active" : "Off"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const password = prompt(
                          `New password for ${user.email} (min 8 chars)`
                        );
                        if (!password) return;
                        if (password.length < 8) {
                          toast.error("Password must be at least 8 characters");
                          return;
                        }
                        void patchUser(user.id, { password });
                      }}
                    >
                      Reset
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={user.id === currentUserId}
                      onClick={() => void removeUser(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No users match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PortalPanel>
    </div>
  );
}
