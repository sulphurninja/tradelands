import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  priority,
  href = "/",
}: {
  className?: string;
  priority?: boolean;
  href?: string;
  /** @deprecated */
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative z-10 inline-flex shrink-0 items-center gap-2",
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
      <span className="text-[0.95rem] font-semibold tracking-[-0.03em] text-current sm:text-[1.15rem]">
        Trade<span className="text-primary">Lands</span>
        <span className="ml-0.5 align-top text-[0.55em] font-medium opacity-60">
          IND
        </span>
      </span>
      <span className="sr-only">TradeLands</span>
    </Link>
  );
}
