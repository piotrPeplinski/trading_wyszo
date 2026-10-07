"use client";

import { useCallback, type KeyboardEvent } from "react";

import type { VideoPlayerApi } from "@/hooks/useVideoPlayer";
import { SKIP_LONG, SKIP_SHORT, VOLUME_STEP } from "@/utils/video/constants";

type Options = {
  player: VideoPlayerApi;
  onSkip: (seconds: number) => void;
  onActivity: () => void;
};

/** YouTube's keyboard map, scoped to the focused player rather than the whole page. */
export const useVideoShortcuts = ({ player, onSkip, onActivity }: Options) =>
  useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const onSlider = e.target instanceof HTMLInputElement;
      const onButton = e.target instanceof HTMLButtonElement;
      const skip = (s: number) => {
        player.skip(s);
        onSkip(s);
      };

      const actions: Record<string, () => void> = {
        k: player.togglePlay,
        j: () => skip(-SKIP_LONG),
        l: () => skip(SKIP_LONG),
        m: player.toggleMute,
        f: player.toggleFullscreen,
      };
      // Sliders and buttons keep their native space/arrow behaviour.
      if (!onButton) actions[" "] = player.togglePlay;
      if (!onSlider) {
        actions.ArrowLeft = () => skip(-SKIP_SHORT);
        actions.ArrowRight = () => skip(SKIP_SHORT);
        actions.ArrowUp = () => player.setVolume(player.volume + VOLUME_STEP);
        actions.ArrowDown = () => player.setVolume(player.volume - VOLUME_STEP);
      }

      const action = actions[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!action) return;
      e.preventDefault();
      action();
      onActivity();
    },
    [player, onSkip, onActivity]
  );
