import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:mb-12",
        align === "center" && "items-center text-center",
        action && "lg:flex-row lg:items-end lg:justify-between lg:gap-8",
        className
      )}
    >
      <div className={cn("min-w-0", align === "center" && "max-w-2xl")}>
        {eyebrow && (
          <p className="mb-2 text-[12px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[1.6rem] font-semibold tracking-[-0.025em] text-balance break-words sm:text-[40px] lg:text-[44px]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed break-words text-muted-foreground sm:text-[17px]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  );
}
