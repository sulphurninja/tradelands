"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormSelect } from "@/components/ui/form-select";

const STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "matched",
  "closed",
  "rejected",
] as const;

export function RequirementStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  return (
    <FormSelect
      value={status}
      onValueChange={async (next) => {
        const res = await fetch(`/api/admin/requirements/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) toast.error("Update failed");
        else {
          toast.success("Status updated");
          router.refresh();
        }
      }}
      options={STATUSES.map((s) => ({ value: s, label: s }))}
      triggerClassName="h-9 w-40"
    />
  );
}
