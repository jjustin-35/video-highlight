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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isIndicatorMoving) return;
      const time = getNewTime(e);
      setIndicatorTime(time);
    };

    const handleMouseUp = () => {
      if (!isIndicatorMoving) return;
      setIsIndicatorMoving(false);
      onTimeChange(indicatorTime);
    };

    if (isIndicatorMoving) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isIndicatorMoving, indicatorTime, onTimeChange]);

  const getNewTime = (e: React.MouseEvent | MouseEvent) => {
    if (!timelineRef.current || duration === 0) return 0;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const time = percentage * duration;

    return time;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isIndicatorMoving) return;
    const time = getNewTime(e);
    setIndicatorTime(time);
    onTimeChange(time);
  };

  const handleIndicatorStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsIndicatorMoving(true);
    const time = getNewTime(e);
    setIndicatorTime(time);
  };

  return (
    <div
      ref={timelineRef}
      className="relative h-2 bg-gray-700 rounded cursor-pointer select-none"
      onMouseDown={handleIndicatorStart}
      onClick={handleTimelineClick}
    >
      {/* track */}
      <div
        className="absolute top-0 bottom-0 left-0 bg-white pointer-events-none"
        style={{
          right: `${(1 - indicatorTime / duration) * 100}%`,
        }}
      >
        {/* indicator */}
        <div className="absolute z-10 top-1/2 right-0 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 translate-x-1/2 pointer-events-auto cursor-grab active:cursor-grabbing" />
      </div>

      {/* Selected segments */}
      {selectedSegments.map((segment, index) => {
        return (
          <div
            key={index}
            className="absolute top-0 h-full bg-green-500 rounded pointer-events-none"
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
