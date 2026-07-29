import { Star } from "lucide-react";
import { testimonials, testimonialsDisclaimer } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";
import { Marquee } from "@/components/ui/Marquee";

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <div className="w-80 shrink-0 rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center gap-1 text-gold-ink">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink/90 sm:text-sm">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green/15 text-xs font-semibold text-green-ink sm:text-sm">
          {testimonial.initials}
        </span>
        <div>
          <p className="text-[11px] text-muted sm:text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-[2.1875rem] sm:py-24">
      <SectionAurora variant="right" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Opinie"
          title="Co mówią członkowie społeczności."
          description={testimonialsDisclaimer}
        />
      </div>

      <div className="mt-8 sm:mt-14">
        <Marquee>
          {testimonials.map((t) => (
            <TestimonialCard key={t.initials + t.role} testimonial={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
