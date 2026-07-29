"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { comparisonRows } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section className="relative overflow-hidden py-[2.1875rem] sm:py-24">
      <SectionAurora variant="right" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Co nas wyróżnia"
          title="Nie kolejny kanał z sygnałami."
          description="Pięć rzeczy, które realnie odróżniają JWFOREX od typowych społeczności tradingowych."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface sm:mt-14"
        >
          <div className="grid grid-cols-2">
            <div className="flex items-center gap-1 border-b border-r border-border bg-red/10 px-2.5 py-2 sm:gap-2 sm:px-5 sm:py-4">
              <X size={18} className="text-red" />
              <span className="text-sm font-semibold text-red sm:text-base">
                Bez JWFOREX
              </span>
            </div>
            <div className="flex items-center gap-1 border-b border-border bg-green/10 px-2.5 py-2 sm:gap-2 sm:px-5 sm:py-4">
              <Check size={18} className="text-green-ink" />
              <span className="text-sm font-semibold text-green-ink sm:text-base">
                Z JWFOREX
              </span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {comparisonRows.map((row, i) => (
              <motion.div
                key={row.with}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={cn("grid grid-cols-2", i % 2 === 1 && "bg-bg-soft/40")}
              >
                <div className="flex items-start gap-1.5 border-r border-border px-2.5 py-2.5 sm:gap-3 sm:px-5 sm:py-5">
                  <X size={16} className="mt-0.5 shrink-0 text-red/70" />
                  <span className="text-justify text-sm leading-relaxed text-muted  sm:text-base">
                    {row.without}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 px-2.5 py-2.5 sm:gap-3 sm:px-5 sm:py-5">
                  <Check size={16} className="mt-0.5 shrink-0 text-green-ink" />
                  <span className="text-justify text-sm leading-relaxed text-ink/90 sm:text-base">
                    {row.with}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
