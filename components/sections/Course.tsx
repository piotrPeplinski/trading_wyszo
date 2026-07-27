"use client";

import { motion } from "framer-motion";
import {
  PlayCircle,
  NotebookPen,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { courseModules } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";

const icons: Record<string, LucideIcon> = {
  PlayCircle,
  NotebookPen,
  BookOpen,
};

export function Course() {
  return (
    <section id="kurs" className="relative overflow-hidden py-14 sm:py-24">
      <SectionAurora variant="left" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kurs 4.0"
          title="Kompletny program nauki, a nie po prostu kolejna dawka nic nie wnoszącej wiedzy technicznej."
          description="Od podstaw struktury rynku po przetestowane systemy SMC — wszystko poukładane w jedną ścieżkę nauki."
        />

        <div className="mt-8 grid gap-5 sm:mt-14 sm:grid-cols-3">
          {courseModules.map((module, i) => {
            const Icon = icons[module.icon];
            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-surface p-7"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green/10 blur-2xl" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-ink">
                  <Icon size={24} />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-semibold text-ink">
                  {module.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">
                  {module.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
