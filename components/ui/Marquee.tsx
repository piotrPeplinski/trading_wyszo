import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
}

export function Marquee({ children, reverse = false, className }: MarqueeProps) {
  return (
    <div className={cn("marquee-pause relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max gap-6",
          reverse ? "marquee-track-reverse" : "marquee-track"
        )}
      >
        <div className="flex shrink-0 gap-6">{children}</div>
        <div aria-hidden className="flex shrink-0 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
