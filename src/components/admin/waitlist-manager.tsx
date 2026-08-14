"use client";

import type { WaitlistItem } from "@/lib/types";
import { DeleteButton } from "@/components/admin/delete-button";

export function WaitlistManager({ initial }: { initial: WaitlistItem[] }) {
  if (!initial.length) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-muted-foreground">
        No waitlist entries yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Project</th>
            <th className="px-4 py-3 text-left font-medium">When</th>
            <th className="px-4 py-3 text-left font-medium" />
          </tr>
        </thead>
        <tbody>
          {initial.map((row) => (
            <tr key={row.id} className="border-t border-border">
              <td className="px-4 py-3">
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  {row.phone || "—"}
                </p>
              </td>
              <td className="px-4 py-3">{row.email}</td>
              <td className="px-4 py-3">{row.projectSlug}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(row.createdAt).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <DeleteButton
                  endpoint={`/api/admin/waitlist/${row.id}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
