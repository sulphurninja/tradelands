"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string;
  onChange: (url: string, meta?: { publicId?: string }) => void;
  folder?: string;
  accept?: string;
  label?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  folder = "tradelands",
  accept = "image/*,application/pdf,video/*",
  label = "Upload file",
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [manual, setManual] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value || "");

  async function onFile(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }
      onChange(data.url, { publicId: data.publicId });
      setUrlDraft(data.url);
      toast.success("Uploaded to Cloudinary");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value && (
        <div className="overflow-hidden rounded-lg border border-border">
          {/\.(mp4|webm|mov)(\?|$)/i.test(value) || value.includes("/video/") ? (
            <video src={value} className="h-36 w-full object-cover" controls />
          ) : /\.(pdf)(\?|$)/i.test(value) ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="flex h-20 items-center px-4 text-sm text-primary underline"
            >
              Open document
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-36 w-full object-cover" />
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          {uploading ? "Uploading…" : label}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setManual((v) => !v)}
        >
          <Link2 className="size-4" />
          Paste URL
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onFile(file);
          e.target.value = "";
        }}
      />

      {manual && (
        <div className="flex gap-2">
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://…"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onChange(urlDraft.trim());
              setManual(false);
            }}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
