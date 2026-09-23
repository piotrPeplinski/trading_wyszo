"use client"

import React from "react"
import { cn } from "@/lib/utils"

const Table = ({ className, ...props }: React.ComponentProps<"table">) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full"
    >
      <table
        data-slot="table"
        className={cn(
          // separate, not collapse: browsers drop border-radius on cells in the
          // collapsed model, and the sticky header needs rounded top corners.
          "w-full caption-bottom border-separate border-spacing-0 text-sm",
          className
        )}
        {...props}
      />
    </div>
  )
}

const TableHeader = ({ className, ...props }: React.ComponentProps<"thead">) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_th]:border-b", className)}
      {...props}
    />
  )
}

const TableBody = ({ className, ...props }: React.ComponentProps<"tbody">) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child>td]:border-b-0", className)}
      {...props}
    />
  )
}

const TableFooter = ({ className, ...props }: React.ComponentProps<"tfoot">) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
 "border-t bg-surface-2/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

const TableRow = ({ className, ...props }: React.ComponentProps<"tr">) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
 "transition-colors hover:bg-surface-2/50 has-aria-expanded:bg-surface-2/50 data-[state=selected]:bg-surface-2 [&>td]:border-b",
        className
      )}
      {...props}
    />
  )
}

const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
 "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-ink [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

const TableCell = ({ className, ...props }: React.ComponentProps<"td">) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
 "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

const TableCaption = ({
  className,
  ...props
}: React.ComponentProps<"caption">) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
