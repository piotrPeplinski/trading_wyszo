"use client";

import { motion } from "framer-motion";
import { LineChart, Users, Repeat, Globe2, type LucideIcon } from "lucide-react";
import { memberAreas } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";

const icons: Record<string, LucideIcon> = {
  LineChart,
  Users,
  Repeat,
  Globe2,
};

export function MemberArea() {
  return (
    <section id="srodek" className="relative overflow-hidden py-14 sm:py-24">
      <SectionAurora variant="left" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="W środku"
          title="Wszystko w jednym miejscu."
          description="Nie tylko kurs — codzienna obecność, community i narzędzia do pracy nad własnym warsztatem."
        />

        <div className="mt-8 grid gap-5 sm:mt-14 sm:grid-cols-2">
          {memberAreas.map((area, i) => {
            const Icon = icons[area.icon];
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.12 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green-ink">
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    {area.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
