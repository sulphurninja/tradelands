import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-sm font-medium leading-none whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:text-foreground dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground dark:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 gap-1.5 rounded-md px-2.5 text-xs [&_svg]:size-3",
        sm: "h-9 gap-1.5 px-3.5 text-[0.8125rem] [&_svg]:size-3.5",
        lg: "h-11 gap-2 px-6 text-[0.9375rem]",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg]:size-3",
        "icon-sm": "size-9 [&_svg]:size-3.5",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return React.cloneElement(children, {
      className: cn(classes, children.props.className),
    });
  }

  return (
    <ButtonPrimitive data-slot="button" className={classes} {...props}>
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
