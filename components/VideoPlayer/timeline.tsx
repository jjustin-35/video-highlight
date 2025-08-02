"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SelectedSegment } from "@/types/video";

interface TimelineProps {
  duration: number;
  currentTime: number;
  selectedSegments: SelectedSegment[];
  onTimeChange: (time: number) => void;
}

const Timeline = ({
  duration,
  currentTime,
  selectedSegments,
  onTimeChange,
}: TimelineProps) => {
  const [isIndicatorMoving, setIsIndicatorMoving] = useState(false);
  const [indicatorTime, setIndicatorTime] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIndicatorTime(currentTime);
  }, [currentTime]);

  const getNewTime = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0) return 0;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const time = percentage * duration;

    return time;
  };

  const handleIndicatorStart = () => {
    setIsIndicatorMoving(true);
  };

  const handleIndicatorMove = (e: React.MouseEvent) => {
    if (!isIndicatorMoving) return;
    const time = getNewTime(e);
    setIndicatorTime(time);
  };

  const handleIndicatorLeave = () => {
    setIsIndicatorMoving(false);
    onTimeChange(indicatorTime);
  };

  return (
    <div
      ref={timelineRef}
      className="relative h-2 bg-gray-700 rounded cursor-pointer"
      onMouseDown={handleIndicatorStart}
      onMouseMove={handleIndicatorMove}
      onMouseUp={handleIndicatorLeave}
    >
      {/* Current time indicator */}
      <div
        className="absolute top-0 bottom-0 left-0 bg-white"
        style={{
          right: `${(1 - indicatorTime / duration) * 100}%`,
        }}
      >
        <div className="absolute z-10 top-1/2 right-0 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Selected segments */}
      {selectedSegments.map((segment, index) => {
        return (
          <div
            key={index}
            className="absolute top-0 h-full bg-green-500 rounded"
            style={{
              left: `${(segment.startTime / duration) * 100}%`,
              width: `${
                ((segment.endTime - segment.startTime) / duration) * 100
              }%`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Timeline;
