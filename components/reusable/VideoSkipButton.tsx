import { RotateCcw, RotateCw } from "lucide-react";

import { VideoIconButton } from "@/components/reusable/VideoIconButton";

type VideoSkipButtonProps = {
  seconds: number;
  onSkip: (seconds: number) => void;
};

export const VideoSkipButton = ({ seconds, onSkip }: VideoSkipButtonProps) => {
  const Icon = seconds < 0 ? RotateCcw : RotateCw;
  const abs = Math.abs(seconds);

  return (
    <VideoIconButton
      label={seconds < 0 ? `Cofnij o ${abs} s` : `Przewiń o ${abs} s`}
      onClick={() => onSkip(seconds)}
    >
      <Icon size={24} strokeWidth={1.75} />
      <span className="absolute inset-0 flex items-center justify-center pt-px text-[9px] font-bold tabular-nums">
        {abs}
      </span>
    </VideoIconButton>
  );
};
