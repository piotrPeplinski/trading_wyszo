"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, VolumeX } from "lucide-react";

import { VideoControls } from "@/components/reusable/VideoControls";
import { VideoSkipFeedback } from "@/components/reusable/VideoSkipFeedback";
import { useAutoplayInView } from "@/hooks/useAutoplayInView";
import { useIdle } from "@/hooks/useIdle";
import { useSkipFeedback } from "@/hooks/useSkipFeedback";
import { useVideoGestures } from "@/hooks/useVideoGestures";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useVideoShortcuts } from "@/hooks/useVideoShortcuts";
import { cn } from "@/lib/utils";
import { CONTROLS_HIDE_MS } from "@/utils/video/constants";
import type { VideoSources } from "@/utils/video/types";

type VideoPlayerProps = {
  sources: VideoSources;
  poster: string;
  label: string;
};

export const VideoPlayer = ({ sources, poster, label }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const player = useVideoPlayer(videoRef, containerRef);
  const near = useAutoplayInView(videoRef, { autoplay: player.autoplay });
  const { idle, poke, hide } = useIdle(CONTROLS_HIDE_MS);
  const { feedback, show: showSkip } = useSkipFeedback();
  const controlsHidden = player.playing && idle;
  const gestures = useVideoGestures({ player, controlsHidden, onSkip: showSkip, onActivity: poke });
  const onKeyDown = useVideoShortcuts({ player, onSkip: showSkip, onActivity: poke });

  // Start the hide countdown when playback starts, even if the pointer never moves.
  useEffect(() => {
    if (player.playing) poke();
  }, [player.playing, poke]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={(e) => e.pointerType === "mouse" && poke()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
      className={cn(
        "relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-white/10 bg-black outline-none focus-visible:ring-2 focus-visible:ring-green/70 [&:fullscreen]:rounded-none [&:fullscreen]:border-0",
        controlsHidden && "cursor-none"
      )}
    >
      <video
        ref={videoRef}
        poster={poster}
        preload={near ? "auto" : "none"}
        playsInline
        className="absolute inset-0 h-full w-full object-contain"
      >
        {near && (
          <>
            <source src={sources.mobile} type="video/mp4" media="(max-width: 767px)" />
            <source src={sources.desktop} type="video/mp4" />
          </>
        )}
      </video>

      <div className="absolute inset-0 z-10" {...gestures} />
      <VideoSkipFeedback feedback={feedback} />

      <AnimatePresence>
        {!player.playing && (
          <motion.button
            type="button"
            key="play"
            aria-label="Odtwórz film"
            onClick={player.play}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute left-1/2 top-1/2 z-20 -ml-9 -mt-9 flex size-18 cursor-pointer items-center justify-center rounded-full bg-green text-[#06110b] transition-[background-color] hover:bg-green/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green sm:-ml-11 sm:-mt-11 sm:size-22",
              !player.started && "glow-pulse"
            )}
          >
            <Play className="ml-1 size-8 sm:size-9" fill="currentColor" strokeWidth={0} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {player.autoMuted && player.playing && (
          <motion.button
            type="button"
            key="unmute"
            onClick={player.toggleMute}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-3 top-3 z-20 flex cursor-pointer items-center gap-2 rounded-full bg-black/70 py-2 pl-3 pr-4 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-green sm:left-4 sm:top-4"
          >
            <VolumeX size={18} className="text-green" />
            Włącz dźwięk
          </motion.button>
        )}
      </AnimatePresence>

      <VideoControls player={player} hidden={controlsHidden} onSkip={showSkip} />
    </div>
  );
};
