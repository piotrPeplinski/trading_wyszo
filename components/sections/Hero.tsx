"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { hero, site } from "@/content/site-content";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { scrollToId } from "@/lib/utils";

const particles = [
  { top: "18%", left: "12%", size: 4, delay: "0s" },
  { top: "30%", left: "82%", size: 6, delay: "1.2s" },
  { top: "62%", left: "8%", size: 5, delay: "2.1s" },
  { top: "72%", left: "76%", size: 4, delay: "0.6s" },
  { top: "45%", left: "50%", size: 3, delay: "1.8s" },
  { top: "20%", left: "60%", size: 5, delay: "0.9s" },
];

export function Hero() {
  const [viewers, setViewers] = useState<number | null>(null);

  useEffect(() => {
    // client-only random value — computed after mount to avoid SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewers(Math.floor(Math.random() * 30) + 24);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="aurora-blob left-[-10%] top-[-10%] h-[420px] w-[420px] bg-green/25"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="aurora-blob right-[-8%] top-[10%] h-[380px] w-[380px] bg-gold/20"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="aurora-blob bottom-[-15%] left-[30%] h-[460px] w-[460px] bg-green/15"
          style={{ animationDelay: "6s" }}
        />
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--color-bg)_75%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6">
        {viewers && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs text-muted backdrop-blur"
          >
            <span className="live-pulse h-2 w-2 rounded-full bg-green" />
            {viewers} osób ogląda teraz tę stronę
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge>
            {hero.badge} · {site.tagline}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl md:text-6xl"
        >
          {hero.headline.map((line, i) => (
            <span key={i} className="block">
              {line === hero.shimmerWord ? (
                <span className="text-shimmer">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button size="lg" onClick={() => scrollToId("cennik")}>
            {hero.ctaPrimary} <ArrowRight size={18} />
          </Button>
          <a
            href="#kurs"
            className="inline-flex h-13 items-center gap-2 rounded-full px-7 text-base font-medium text-muted transition-colors hover:text-ink"
          >
            {hero.ctaSecondary} <ChevronDown size={16} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-6 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur sm:mt-16 sm:grid-cols-4 sm:p-8"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <div className="font-display text-2xl font-bold text-ink sm:text-3xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </div>
              <span className="text-center text-xs text-muted sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
