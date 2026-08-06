"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface FormSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "default";
}

export function FormSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  name,
  required,
  disabled,
  id,
  className,
  triggerClassName,
  contentClassName,
  size = "default",
}: FormSelectProps) {
  const labelByValue = Object.fromEntries(
    options.map((option) => [option.value, option.label])
  );

  return (
    <Select
      value={value || null}
      onValueChange={(next) => onValueChange(next ?? "")}
      name={name}
      required={required}
      disabled={disabled}
      items={options.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
    >
      <SelectTrigger
        id={id}
        size={size}
        className={cn(
          "h-10 w-full min-w-0 bg-background dark:bg-input/40",
          triggerClassName,
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {(selected) =>
            selected == null
              ? placeholder
              : labelByValue[String(selected)] ?? String(selected)
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className={cn(
          "z-[120] border border-border bg-popover text-popover-foreground",
          contentClassName
        )}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
