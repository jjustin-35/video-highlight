import { formatTime } from "@/helpers/formatTime";
import Button from "@/components/Button";
import Slider from "@/components/Slider";
import { Pause, Play, Volume2 } from "lucide-react";

interface ControlBarProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleVolumeChange: (value: number[]) => void;
}

const ControlBar = ({
  currentTime,
  duration,
  isPlaying,
  handlePlayPause,
  handleVolumeChange,
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
          className="flex items-center gap-2 text-white group/volume"
        >
          <Volume2 className="w-4 h-4" />
          <Slider
            defaultValue={[1]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.1}
            className="w-0 opacity-0 transition-all duration-300 group-hover/volume:w-20 group-hover/volume:opacity-100"
          />
        </div>

        <div className="text-xs text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
