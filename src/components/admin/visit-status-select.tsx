"use client";

import { toast } from "sonner";
import { FormSelect } from "@/components/ui/form-select";

export function VisitStatusSelect({
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
        const res = await fetch(`/api/admin/site-visits/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) toast.error("Update failed");
        else toast.success("Status updated");
      }}
      options={["requested", "confirmed", "completed", "cancelled"].map(
        (s) => ({ value: s, label: s })
      )}
      triggerClassName="h-9 w-40"
    />
  );
}
