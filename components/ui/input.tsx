import React from "react"
import { cn } from "@/lib/utils"

const Input = ({ className, type, ...props }: React.ComponentProps<"input">) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
 "h-9 w-full min-w-0 rounded-xl border border-border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-green selection:text-[#06110b] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
 "focus-visible:border-green/40 focus-visible:ring-[3px] focus-visible:ring-green/40",
 "aria-invalid:border-red aria-invalid:ring-red/20",
        // Native date fields stretched full-width read as empty boxes on a
        // phone. Content width on mobile only; desktop keeps w-full.
        type === "date" && "w-auto min-w-40 max-w-full sm:w-full sm:min-w-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
