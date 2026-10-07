"use client";

import { motion } from "framer-motion";

import { journalVideo } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";
import { VideoPlayer } from "@/components/reusable/VideoPlayer";

export const JournalVideo = () => (
  <section id="film" className="relative overflow-hidden py-[2.1875rem] sm:py-24">
    <SectionAurora variant="left" />
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <SectionHeading title={journalVideo.title} />
    </div>

    {/* Wider than the text column, but capped so a 16:9 frame never outgrows the viewport height. */}
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-8 w-full max-w-[min(1400px,calc(85svh*16/9+3rem))] px-4 sm:mt-14 sm:px-6"
    >
      <div className="rounded-2xl shadow-[0_40px_120px_-40px_rgba(186,255,98,0.35),0_24px_48px_-24px_rgba(0,0,0,0.6)]">
        <VideoPlayer
          sources={journalVideo.sources}
          poster={journalVideo.poster}
          label={journalVideo.label}
        />
      </div>
    </motion.div>
  </section>
);
