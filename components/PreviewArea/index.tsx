"use client";

import { useState } from "react";
import type { SelectedSegment, TranscriptSentence } from "@/types/video";
import { useVideoEditor } from "@/contexts/videoContext";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Timeline } from "@/components/Timeline";
import { TranscriptOverlay } from "@/components/TranscriptOverlay";

const PreviewArea = () => {
  const [duration, setDuration] = useState(0);
  const {
    videoUrl,
    currentTime,
    isPlaying,
    getSelectedSegments,
    setCurrentTime,
    setIsPlaying,
  } = useVideoEditor();
  const selectedSegments = getSelectedSegments();

  let currentData: {
    segment: SelectedSegment;
    index: number;
    currentSentence: TranscriptSentence | null;
  } | null = null;

  for (let i = 0; i < selectedSegments.length; i++) {
    const segment = selectedSegments[i];
    if (currentTime >= segment.startTime && currentTime <= segment.endTime) {
      const currentSentence = segment.sentences.find(
        (s) => currentTime >= s.startTime && currentTime <= s.endTime
      ) || null;
      currentData = {
        segment,
        index: i,
        currentSentence,
      };
    }
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Preview</h2>
        <div className="text-sm text-gray-400">
          {selectedSegments.length} segments •
          {Math.round(
            selectedSegments.reduce(
              (total, seg) => total + (seg.endTime - seg.startTime),
              0
            )
          )}
          s total
        </div>
      </div>

      <div className="flex-1 relative">
        <VideoPlayer
          src={videoUrl}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTimeUpdate={setCurrentTime}
          onPlayStateChange={setIsPlaying}
          onDurationChange={setDuration}
        />

        {currentData?.currentSentence && (
          <TranscriptOverlay
            text={currentData.currentSentence.text}
            isVisible={true}
          />
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <Timeline
          duration={duration}
          currentTime={currentTime}
          selectedSegments={selectedSegments}
          onSeek={setCurrentTime}
        />
      </div>
    </div>
  );
};

export default PreviewArea;
