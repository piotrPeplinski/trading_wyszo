import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
