import { Check } from "lucide-react";
import { trustPoints } from "@/content/site-content";
import { Marquee } from "@/components/ui/Marquee";

export function TrustBar() {
  return (
    <section className="border-y border-border bg-bg-soft py-6">
      <Marquee>
        {trustPoints.map((point) => (
          <span
            key={point}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
          >
            <Check size={14} className="text-green-ink" />
            {point}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
