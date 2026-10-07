"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";

import type { VideoPlayerApi } from "@/hooks/useVideoPlayer";
import { DOUBLE_TAP_MS, SKIP_LONG } from "@/utils/video/constants";

type Options = {
  player: VideoPlayerApi;
  controlsHidden: boolean;
  onSkip: (seconds: number) => void;
  onActivity: () => void;
};

/**
 * Mouse: click toggles play, double-click toggles fullscreen.
 * Touch: tap reveals the controls (or toggles play when they're up),
 * double-tap on the left/right half skips ∓10 s — like YouTube's app.
 */
export const useVideoGestures = ({ player, controlsHidden, onSkip, onActivity }: Options) => {
  const lastTap = useRef(0);
  const lastPointer = useRef("");
  const pendingTap = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(pendingTap.current), []);

  const onPointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      lastPointer.current = e.pointerType;
      if (e.pointerType === "mouse") {
        player.togglePlay();
        onActivity();
        return;
      }

      const now = e.timeStamp;
      if (now - lastTap.current < DOUBLE_TAP_MS) {
        clearTimeout(pendingTap.current);
        lastTap.current = 0;
        const rect = e.currentTarget.getBoundingClientRect();
        const seconds = e.clientX - rect.left < rect.width / 2 ? -SKIP_LONG : SKIP_LONG;
        player.skip(seconds);
        onSkip(seconds);
        onActivity();
        return;
      }

      lastTap.current = now;
      const wasHidden = controlsHidden;
      pendingTap.current = setTimeout(() => {
        if (!wasHidden) player.togglePlay();
        onActivity();
      }, DOUBLE_TAP_MS);
    },
    [player, controlsHidden, onSkip, onActivity]
  );

  // Touch double-taps are handled above; only a real mouse goes fullscreen.
  const onDoubleClick = useCallback(() => {
    if (lastPointer.current === "mouse") player.toggleFullscreen();
  }, [player]);

  return { onPointerUp, onDoubleClick };
};
