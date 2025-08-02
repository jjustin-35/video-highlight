import { useState } from "react";
import { formatTime } from "@/helpers/formatTime";
import Button from "@/components/Button";
import Slider from "@/components/Slider";
import { combineClass } from "@/helpers/combineClass";
import { Pause, Play, Volume2, Maximize } from "lucide-react";

interface ControlBarProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleVolumeChange: (value: number[]) => void;
  handleFullscreen: () => void;
}

const ControlBar = ({
  currentTime,
  duration,
  isPlaying,
  handlePlayPause,
  handleVolumeChange,
  handleFullscreen,
}: ControlBarProps) => {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayPause}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        <div
          className="flex items-center gap-2 text-white group"
        >
          <Volume2 className="w-4 h-4" />
          <Slider
            defaultValue={[1]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.1}
            className="w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
          />
        </div>

        <div className="text-xs text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleFullscreen}
        className="text-white hover:bg-white/20"
      >
        <Maximize className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ControlBar;
