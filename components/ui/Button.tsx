import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-[#06110b] hover:bg-green/90 shadow-[0_0_0_1px_rgba(34,214,126,0.3)]",
  secondary:
    "bg-surface-2 text-ink border border-border hover:border-green/50 hover:text-green-ink",
  ghost: "bg-transparent text-ink hover:bg-surface-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm sm:h-11 sm:px-5",
  lg: "h-12 px-6 text-sm sm:h-13 sm:px-7 sm:text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "btn-shine inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonClasses(variant, size, className)} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
