"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { bufferedEnd, clamp } from "@/utils/video/functions";

type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * Mirrors the <video> element into React state and wraps its API.
 * The element stays the source of truth: actions write to it, its events write back.
 */
export const useVideoPlayer = (
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  /** Muted by autoplay rather than by the viewer — drives the "Włącz dźwięk" prompt. */
  const [autoMuted, setAutoMuted] = useState(false);
  /** Set when the viewer pauses, so scrolling back doesn't override their choice. */
  const userPausedRef = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let frame = 0;
    // timeupdate fires ~4×/s — too coarse for a smooth progress bar.
    const tick = () => {
      setTime(v.currentTime);
      frame = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(frame);
      setTime(v.currentTime);
    };
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);
    const onProgress = () => setBuffered(bufferedEnd(v));
    const onVolume = () => {
      setVolumeState(v.volume);
      setMuted(v.muted);
    };
    const onFullscreen = () => setFullscreen(document.fullscreenElement === containerRef.current);

    const events: [string, () => void][] = [
      ["play", onPlay],
      ["pause", onPause],
      ["seeked", onTime],
      ["timeupdate", onProgress],
      ["loadedmetadata", onMeta],
      ["durationchange", onMeta],
      ["progress", onProgress],
      ["volumechange", onVolume],
    ];
    events.forEach(([name, fn]) => v.addEventListener(name, fn));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      cancelAnimationFrame(frame);
      events.forEach(([name, fn]) => v.removeEventListener(name, fn));
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [videoRef, containerRef]);

  const play = useCallback(() => {
    userPausedRef.current = false;
    videoRef.current?.play().catch(() => {});
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) return play();
    userPausedRef.current = true;
    v.pause();
  }, [videoRef, play]);

  const seek = useCallback(
    (t: number) => {
      const v = videoRef.current;
      if (!v || !v.duration) return;
      v.currentTime = clamp(t, 0, v.duration);
      setTime(v.currentTime);
    },
    [videoRef]
  );

  const skip = useCallback(
    (delta: number) => seek((videoRef.current?.currentTime ?? 0) + delta),
    [videoRef, seek]
  );

  const setVolume = useCallback(
    (next: number) => {
      const v = videoRef.current;
      if (!v) return;
      v.volume = clamp(next, 0, 1);
      v.muted = v.volume === 0;
      setAutoMuted(false);
    },
    [videoRef]
  );

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted && v.volume === 0) v.volume = 1;
    v.muted = !v.muted;
    setAutoMuted(false);
  }, [videoRef]);

  /** Autoplay is only allowed muted — remember that it wasn't the viewer's choice. */
  const autoplay = useCallback(() => {
    const v = videoRef.current;
    if (!v || userPausedRef.current || !v.paused) return;
    if (!started) {
      v.muted = true;
      setAutoMuted(true);
    }
    v.play().catch(() => {});
  }, [videoRef, started]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    const v = videoRef.current as IOSVideo | null;
    if (document.fullscreenElement) return void document.exitFullscreen();
    // iPhone Safari has no element fullscreen — only the native video one.
    if (container?.requestFullscreen) return void container.requestFullscreen().catch(() => {});
    v?.webkitEnterFullscreen?.();
  }, [containerRef, videoRef]);

  return {
    playing,
    started,
    time,
    duration,
    buffered,
    volume: muted ? 0 : volume,
    muted,
    autoMuted,
    fullscreen,
    userPausedRef,
    play,
    togglePlay,
    seek,
    skip,
    setVolume,
    toggleMute,
    autoplay,
    toggleFullscreen,
  };
};

export type VideoPlayerApi = ReturnType<typeof useVideoPlayer>;
