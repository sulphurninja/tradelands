"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  endpoint,
  label = "Delete",
}: {
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="text-destructive"
      onClick={async () => {
        if (!confirm("Delete this item?")) return;
        const res = await fetch(endpoint, { method: "DELETE" });
        if (!res.ok) {
          toast.error("Delete failed");
          return;
        }
        toast.success("Deleted");
        router.refresh();
      }}
    >
      {label}
    </Button>
  );
}
