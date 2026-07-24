"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import {
  pricingPlans,
  planBenefits,
  pricingNote,
  installmentsNote,
} from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Plan = (typeof pricingPlans)[number];

function PricingCard({ plan, revealed }: { plan: Plan; revealed: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-7",
        plan.highlight ? "glow-pulse border-green/60 bg-surface" : "border-border bg-surface"
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold",
            plan.highlight ? "bg-green text-[#06110b]" : "bg-gold/20 text-gold-ink"
          )}
        >
          {plan.badge}
        </span>
      )}

      <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted">{plan.description}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold text-ink">{plan.price} PLN</span>
        <span className="text-sm text-muted">{plan.period}</span>
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {planBenefits.map((benefit, bi) => {
          const included = bi < plan.includedCount;
          return (
            <li
              key={benefit}
              className={cn(
                "flex items-start gap-2 text-sm",
                included ? "text-ink/85" : "text-muted-2 line-through"
              )}
            >
              {included ? (
                <Check size={16} className="mt-0.5 shrink-0 text-green-ink" />
              ) : (
                <X size={16} className="mt-0.5 shrink-0 text-muted-2" />
              )}
              {benefit}
            </li>
          );
        })}
      </ul>

      <a
        href={plan.url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses(plan.highlight ? "primary" : "secondary", "md", "mt-7 w-full")}
      >
        {plan.cta}
      </a>
    </motion.div>
  );
}

type Phase = "before" | "locked" | "done";

/** Wheel/touch-driven reveal: each scroll tick shows the next card while the
 *  page is pinned. Scrolling up does nothing. Once every card is visible the
 *  lock releases permanently and scrolling behaves normally from then on. */
function usePricingScrollLock(total: number) {
  const [phase, setPhaseState] = useState<Phase>("before");
  const [revealedCount, setRevealedCount] = useState(1);
  const spacerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("before");
  const revealedRef = useRef(1);
  const lastStepRef = useRef(0);
  const touchYRef = useRef(0);

  const lockedYRef = useRef(0);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  // Detect first arrival at the section (ref-driven guard so this only ever fires once).
  useEffect(() => {
    const el = spacerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phaseRef.current === "before") {
          el.scrollIntoView({ block: "start", behavior: "instant" });
          lockedYRef.current = window.scrollY;
          setPhase("locked");
        }
      },
      { threshold: 0, rootMargin: "0px 0px -100% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Safety net: preventDefault() on wheel/touchmove is not 100% reliable across
  // browsers (notably touch Safari). Whenever the page drifts away from the
  // locked position while locked, snap it back instantly on the next tick.
  useEffect(() => {
    const onScroll = () => {
      if (phaseRef.current === "locked" && window.scrollY !== lockedYRef.current) {
        window.scrollTo({ top: lockedYRef.current, behavior: "instant" });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Single persistent listener attached from mount — avoids any race between the
  // observer flipping the phase and a listener being attached in time to catch it.
  useEffect(() => {
    const STEP_COOLDOWN = 550;

    const advance = () => {
      const now = Date.now();
      if (now - lastStepRef.current < STEP_COOLDOWN) return;
      lastStepRef.current = now;
      revealedRef.current = Math.min(revealedRef.current + 1, total);
      setRevealedCount(revealedRef.current);
      if (revealedRef.current >= total) {
        window.setTimeout(() => setPhase("done"), 500);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current !== "locked") return;
      e.preventDefault();
      if (e.deltaY > 0) advance();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (phaseRef.current !== "locked") return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = touchYRef.current - y;
      if (delta > 30) {
        advance();
        touchYRef.current = y;
      } else if (delta < -30) {
        touchYRef.current = y;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [total]);

  return { phase, revealedCount, spacerRef };
}

export function Pricing() {
  const total = pricingPlans.length;
  const { phase, revealedCount, spacerRef } = usePricingScrollLock(total);
  const isLocked = phase === "locked";

  const grid = (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
      {pricingPlans.map((plan, i) => (
        <PricingCard key={plan.name} plan={plan} revealed={i < revealedCount} />
      ))}
    </div>
  );

  return (
    <section id="cennik" className="relative overflow-hidden py-14 sm:py-24">
      <SectionAurora variant="right" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Cennik"
          title="Jeden system, przejrzysta cena."
          description={installmentsNote}
        />
      </div>

      <div
        ref={spacerRef}
        className="relative mt-8 flex min-h-screen items-center justify-center sm:mt-14"
      >
        {isLocked ? (
          <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg px-4">
            {grid}
            <div className="mt-8 flex gap-2">
              {pricingPlans.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-colors",
                    i < revealedCount ? "bg-green" : "bg-surface-2"
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          grid
        )}
      </div>

      <p className="mx-auto mt-8 max-w-xl px-4 text-center text-sm text-muted">{pricingNote}</p>
    </section>
  );
}
