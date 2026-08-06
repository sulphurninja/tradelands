"use client";

import { toast } from "sonner";
import { FormSelect } from "@/components/ui/form-select";

export function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  return (
    <FormSelect
      value={status}
      onValueChange={async (next) => {
        const res = await fetch(`/api/admin/leads/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) toast.error("Update failed");
        else toast.success("Status updated");
      }}
      options={[
        "new",
        "contacted",
        "qualified",
        "site-visit",
        "booked",
        "lost",
      ].map((s) => ({ value: s, label: s }))}
      triggerClassName="h-9 w-40"
    />
  );
}
