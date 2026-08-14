import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  priority,
  href = "/",
  onDark,
}: {
  className?: string;
  priority?: boolean;
  href?: string;
  /** Light logo treatment when sitting on dark/hero media */
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative z-10 inline-flex shrink-0 items-center gap-2",
        onDark ? "text-white" : "text-current",
        className
      )}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={120}
        height={72}
        priority={priority}
        className="h-8 w-auto object-contain sm:h-9"
      />
      <span className="text-[0.95rem] font-semibold tracking-[-0.03em] sm:text-[1.15rem]">
        Trade
        <span className={onDark ? "text-[#9fe870]" : "text-primary"}>
          Lands
        </span>
        <span
          className={cn(
            "ml-0.5 align-top text-[0.55em] font-medium",
            onDark ? "text-white/70" : "opacity-60"
          )}
        >
          IND
        </span>
      </span>
      <span className="sr-only">TradeLands</span>
    </Link>
  );
}
