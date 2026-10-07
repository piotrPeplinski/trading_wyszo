"use client";

import { Maximize, Minimize, Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";

import { VideoIconButton } from "@/components/reusable/VideoIconButton";
import { VideoSkipButton } from "@/components/reusable/VideoSkipButton";
import { VideoSlider } from "@/components/reusable/VideoSlider";
import type { VideoPlayerApi } from "@/hooks/useVideoPlayer";
import { cn } from "@/lib/utils";
import { SKIP_LONG } from "@/utils/video/constants";
import { formatTime } from "@/utils/video/functions";

type VideoControlsProps = {
  player: VideoPlayerApi;
  hidden: boolean;
  onSkip: (seconds: number) => void;
};

export const VideoControls = ({ player, hidden, onSkip }: VideoControlsProps) => {
  const VolumeIcon = player.volume === 0 ? VolumeX : player.volume < 0.5 ? Volume1 : Volume2;
  const skip = (seconds: number) => {
    player.skip(seconds);
    onSkip(seconds);
  };

  return (
    <div
      className={cn(
        // The gradient is decoration only — on a phone-sized player it reaches up over
        // the big play button, so taps must fall through it to whatever sits below.
        "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/85 via-black/45 to-transparent px-2 pb-1 pt-14 transition-[opacity,translate] duration-300 ease-out sm:px-4 sm:pb-2",
        hidden && "translate-y-2 opacity-0"
      )}
    >
      <VideoSlider
        value={player.time}
        max={player.duration}
        buffered={player.buffered}
        onChange={player.seek}
        label="Przewijanie"
        valueText={`${formatTime(player.time)} z ${formatTime(player.duration)}`}
        formatHover={formatTime}
        className={cn("mx-2", !hidden && "pointer-events-auto")}
      />

      <div className={cn("flex items-center justify-between gap-2", !hidden && "pointer-events-auto")}>
        <div className="flex min-w-0 items-center">
          <VideoIconButton
            label={player.playing ? "Pauza (k)" : "Odtwórz (k)"}
            onClick={player.togglePlay}
          >
            {player.playing ? (
              <Pause size={22} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={22} fill="currentColor" strokeWidth={0} />
            )}
          </VideoIconButton>
          <VideoSkipButton seconds={-SKIP_LONG} onSkip={skip} />
          <VideoSkipButton seconds={SKIP_LONG} onSkip={skip} />

          <div className="group/volume flex items-center">
            <VideoIconButton
              label={player.muted ? "Włącz dźwięk (m)" : "Wycisz (m)"}
              onClick={player.toggleMute}
            >
              <VolumeIcon size={22} strokeWidth={1.75} />
            </VideoIconButton>
            {/* Touch devices set volume with hardware keys — iOS ignores video.volume anyway. */}
            <div className="hidden w-0 overflow-hidden opacity-0 transition-[width,opacity] duration-300 ease-out group-hover/volume:w-24 group-hover/volume:opacity-100 group-focus-within/volume:w-24 group-focus-within/volume:opacity-100 pointer-fine:block">
              <VideoSlider
                value={player.volume}
                max={1}
                onChange={player.setVolume}
                label="Głośność"
                valueText={`${Math.round(player.volume * 100)}%`}
                className="mx-2"
              />
            </div>
          </div>

          <span className="ml-2 whitespace-nowrap text-xs font-medium tabular-nums text-white/80 sm:text-sm">
            {formatTime(player.time)}
            <span className="text-white/45"> / {formatTime(player.duration)}</span>
          </span>
        </div>

        <VideoIconButton
          label={player.fullscreen ? "Zamknij pełny ekran (f)" : "Pełny ekran (f)"}
          onClick={player.toggleFullscreen}
        >
          {player.fullscreen ? (
            <Minimize size={20} strokeWidth={1.75} />
          ) : (
            <Maximize size={20} strokeWidth={1.75} />
          )}
        </VideoIconButton>
      </div>
    </div>
  );
};
