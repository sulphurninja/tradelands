"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileUp, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 5;
const MAX_DOCS = 5;

export function SaleLandDialog({
  triggerClassName,
  triggerLabel = "Sell land",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideTrigger = false,
  source = "homepage-sale-land",
}: {
  triggerClassName?: string;
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  source?: string;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;

  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [docs, setDocs] = useState<File[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      trackMetaCustom("SellLandOpen", { source });
    }
  }, [open, source]);

  function reset() {
    setDone(false);
    setPending(false);
    setPhotos([]);
    setDocs([]);
    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    if (photoRef.current) photoRef.current.value = "";
    if (docRef.current) docRef.current.value = "";
  }

  function onOpenChange(next: boolean) {
    if (next) {
      trackMetaCustom("SellLandClick", { source });
    }
    setOpen(next);
    if (!next) reset();
  }

  function addPhotos(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const next = [...photos, ...incoming].slice(0, MAX_PHOTOS);
    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return next.map((f) => URL.createObjectURL(f));
    });
    setPhotos(next);
  }

  function removePhoto(i: number) {
    const next = photos.filter((_, idx) => idx !== i);
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]!);
      return next.map((f) => URL.createObjectURL(f));
    });
    setPhotos(next);
  }

  function addDocs(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list);
    setDocs((prev) => [...prev, ...incoming].slice(0, MAX_DOCS));
  }

  function removeDoc(i: number) {
    setDocs((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (photos.length === 0 && docs.length === 0) {
      toast.error("Please upload at least one photo or document.");
      return;
    }
    setPending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("source", source);
    data.delete("photos");
    data.delete("documents");
    for (const file of photos) data.append("photos", file);
    for (const file of docs) data.append("documents", file);

    try {
      const res = await fetch("/api/sale-land", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.error || "Submission failed");
        setPending(false);
        return;
      }
      trackMeta("Lead", {
        content_name: "Sell Land",
        content_category: "sell",
        source,
      });
      trackMetaCustom("SellLandSubmit", { source });
      setDone(true);
      toast.success("Submitted successfully");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger ? (
        <DialogTrigger
          className={cn(
            "inline-flex h-12 items-center justify-center rounded-full bg-background px-7 text-sm font-semibold text-foreground transition hover:bg-background/90",
            triggerClassName
          )}
        >
          {triggerLabel}
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="flex flex-col items-center px-2 py-8 text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <DialogHeader className="mt-4 items-center">
              <DialogTitle className="text-xl">Submission received</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                A member of our team will contact you shortly.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mt-6 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sell your land</DialogTitle>
              <DialogDescription>
                Share your name, phone number, land size, location, and
                documents. Our team will follow up with you.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="mt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sale-name">Name</Label>
                <Input
                  id="sale-name"
                  name="name"
                  required
                  minLength={2}
                  placeholder="Full name"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-phone">Contact number</Label>
                <Input
                  id="sale-phone"
                  name="phone"
                  type="tel"
                  required
                  minLength={10}
                  placeholder="+91 98xxx xxxxx"
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-acres">Land size (acres)</Label>
                <Input
                  id="sale-acres"
                  name="landSize"
                  required
                  placeholder="e.g. 12 acres"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-pin">Location</Label>
                <Textarea
                  id="sale-pin"
                  name="pinLocation"
                  required
                  minLength={5}
                  rows={2}
                  placeholder="Village, tehsil, or Google Maps link"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-rate">
                  Expected rate{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="sale-rate"
                  name="rate"
                  placeholder="e.g. ₹80,00,000 per acre"
                />
              </div>

              <div className="space-y-2">
                <Label>Photos</Label>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  multiple
                  className="sr-only"
                  onChange={(e) => addPhotos(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  <ImagePlus className="size-4" />
                  Add photos ({photos.length}/{MAX_PHOTOS})
                </button>
                {previews.length ? (
                  <ul className="grid grid-cols-3 gap-2 pt-1">
                    {previews.map((src, i) => (
                      <li
                        key={src}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="size-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white"
                          aria-label="Remove photo"
                        >
                          <X className="size-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Documents</Label>
                <input
                  ref={docRef}
                  type="file"
                  accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  className="sr-only"
                  onChange={(e) => addDocs(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => docRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  <FileUp className="size-4" />
                  Upload documents ({docs.length}/{MAX_DOCS})
                </button>
                {docs.length ? (
                  <ul className="space-y-1.5 pt-1">
                    {docs.map((f, i) => (
                      <li
                        key={`${f.name}-${i}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs"
                      >
                        <span className="truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDoc(i)}
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Remove document"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="text-[11px] text-muted-foreground">
                  Title papers, survey maps, and related files (PDF or images,
                  up to 6MB each)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-notes">
                  Notes <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="sale-notes"
                  name="notes"
                  rows={2}
                  placeholder="Access road, title status, or other details"
                />
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="h-11 w-full rounded-full"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
