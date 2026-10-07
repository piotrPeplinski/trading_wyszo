import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type VideoIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export const VideoIconButton = ({ label, className, children, ...props }: VideoIconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-green sm:size-10",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
