"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SkipFeedback } from "@/utils/video/types";

type VideoSkipFeedbackProps = {
  feedback: SkipFeedback | null;
};

export const VideoSkipFeedback = ({ feedback }: VideoSkipFeedbackProps) => (
  <AnimatePresence>
    {feedback && (
      <motion.div
        key={feedback.side}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "pointer-events-none absolute inset-y-0 z-10 flex w-2/5 items-center justify-center overflow-hidden bg-white/[0.07]",
          feedback.side === "back" ? "left-0 rounded-r-[50%]" : "right-0 rounded-l-[50%]"
        )}
      >
        <motion.span
          key={feedback.key}
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute size-32 rounded-full bg-white/20"
        />
        <span className="relative flex flex-col items-center gap-1 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
          {feedback.side === "back" ? <ChevronsLeft size={28} /> : <ChevronsRight size={28} />}
          <span className="text-sm font-semibold tabular-nums">
            {feedback.side === "back" ? "−" : "+"}
            {feedback.seconds} s
          </span>
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);
