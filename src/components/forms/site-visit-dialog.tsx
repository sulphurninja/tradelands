"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiteVisitForm } from "@/components/forms/site-visit-form";

export function SiteVisitDialog({
  projectSlug,
  triggerLabel = "Book site visit",
  className,
}: {
  projectSlug?: string;
  triggerLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground",
          className
        )}
      >
        <CalendarDays className="size-4" />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a site visit</DialogTitle>
          <DialogDescription>
            Pick a slot — we will confirm by email and in your portal.
          </DialogDescription>
        </DialogHeader>
        <SiteVisitForm
          defaultProject={projectSlug}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
