"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** For grid callers that need the field to span differently per breakpoint. */
  className?: string;
  children: React.ReactNode;
};

/**
 * Label + control + error + hint. When htmlFor is omitted a stable id is generated,
 * so the caller can wire it to the control via the `id` it renders.
 */
export const FormField = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) => {
  const generatedId = useId();
  const id = htmlFor ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-red" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p role="alert" className="text-xs text-red">
          {error}
        </p>
      )}

      {!error && hint && <p className="text-xs text-muted-2">{hint}</p>}
    </div>
  );
};
