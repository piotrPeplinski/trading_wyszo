"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import {
  pricingPlans,
  planBenefits,
  installmentsNote,
} from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Plan = (typeof pricingPlans)[number];

function PricingCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
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

export function Pricing() {
  return (
    <section id="cennik" className="relative overflow-hidden py-[2.1875rem] sm:py-24">
      <SectionAurora variant="right" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Cennik"
          title="Jeden system, przejrzysta cena."
          description={installmentsNote}
        />
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 sm:mt-14 sm:px-6 lg:grid-cols-3">
        {pricingPlans.map((plan, i) => (
          <PricingCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>
    </section>
  );
}
