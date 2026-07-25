"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { proof, proofDisclaimer } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { scrollToId } from "@/lib/utils";

const proofRows = (() => {
  const withIndex = proof.images.map((src, index) => ({ src, index }));
  const mid = Math.ceil(withIndex.length / 2);
  return [withIndex.slice(0, mid), withIndex.slice(mid)];
})();

function ProofCertCard({ src, onClick }: { src: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-48 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface text-left transition-transform duration-300 hover:-translate-y-1 hover:border-green/50 sm:w-60"
    >
      <Image
        src={`/certs/${src}`}
        alt="Certyfikat i wypłata członka społeczności JWFOREX"
        width={480}
        height={600}
        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
        <span className="flex items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-2 text-xs font-semibold text-ink">
          <Expand size={14} className="text-green-ink" />
          Zobacz
        </span>
      </div>
    </button>
  );
}

function ProofLightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const total = proof.images.length;
  const goPrev = useCallback(
    () => onNavigate((index - 1 + total) % total),
    [index, total, onNavigate]
  );
  const goNext = useCallback(() => onNavigate((index + 1) % total), [index, total, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, goPrev, goNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      <button
        onClick={onClose}
        aria-label="Zamknij"
        className="absolute right-4 top-4 z-10 rounded-full border border-border bg-surface p-2 text-muted transition-colors hover:text-ink"
      >
        <X size={20} />
      </button>

      <button
        onClick={goPrev}
        aria-label="Poprzedni certyfikat"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-surface p-2 text-muted transition-colors hover:text-ink sm:left-4"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={goNext}
        aria-label="Następny certyfikat"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-surface p-2 text-muted transition-colors hover:text-ink sm:right-4"
      >
        <ChevronRight size={22} />
      </button>

      <div className="relative z-0 flex max-h-[85vh] w-full max-w-3xl items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={proof.images[index]}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/50"
          >
            <Image
              src={`/certs/${proof.images[index]}`}
              alt="Certyfikat i wypłata członka społeczności JWFOREX"
              width={1200}
              height={1200}
              className="max-h-[85vh] w-auto object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
        {index + 1} / {total}
      </div>
    </motion.div>
  );
}

export function Proof() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-14 sm:py-24">
      <SectionAurora variant="left" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <SectionHeading
          eyebrow={proof.eyebrow}
          title={proof.title}
          description={proof.description}
        />
        <Button size="lg" className="mt-8" onClick={() => scrollToId("cennik")}>
          {proof.cta}
        </Button>
      </div>

      <motion.div
        className="relative mt-8 space-y-4 sm:mt-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {proofRows.map((row, rowIndex) => (
          <Marquee key={rowIndex} reverse={rowIndex === 1}>
            {row.map(({ src, index }) => (
              <ProofCertCard key={src} src={src} onClick={() => setActiveIndex(index)} />
            ))}
          </Marquee>
        ))}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg to-transparent sm:w-32" />
      </motion.div>

      <p className="mx-auto mt-8 max-w-2xl px-4 text-center text-xs leading-relaxed text-muted-2 sm:px-6">
        {proofDisclaimer}
      </p>

      <AnimatePresence>
        {activeIndex !== null && (
          <ProofLightbox
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
