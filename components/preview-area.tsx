"use client"

import { useState } from "react"
import { VideoPlayer } from "@/components/VideoPlayer"
import { Timeline } from "@/components/timeline"
import { TranscriptOverlay } from "@/components/transcript-overlay"
import type { SelectedSegment } from "@/types/video"

interface PreviewAreaProps {
  videoUrl: string
  selectedSegments: SelectedSegment[]
  currentTime: number
  isPlaying: boolean
  onTimeUpdate: (time: number) => void
  onPlayStateChange: (playing: boolean) => void
}

export function PreviewArea({
  videoUrl,
  selectedSegments,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onPlayStateChange,
}: PreviewAreaProps) {
  const [duration, setDuration] = useState(0)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)

  // Find current segment and text for overlay
  const getCurrentSegmentData = () => {
    for (let i = 0; i < selectedSegments.length; i++) {
      const segment = selectedSegments[i]
      if (currentTime >= segment.startTime && currentTime <= segment.endTime) {
        return {
          segment,
          index: i,
          currentSentence: segment.sentences.find((s) => currentTime >= s.startTime && currentTime <= s.endTime),
        }
      }
    }
    return null
  }

  const currentData = getCurrentSegmentData()

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Preview</h2>
        <div className="text-sm text-gray-400">
          {selectedSegments.length} segments •{" "}
          {Math.round(selectedSegments.reduce((total, seg) => total + (seg.endTime - seg.startTime), 0))}s total
        </div>
      </div>

      <div className="flex-1 relative">
        <VideoPlayer
          src={videoUrl}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTimeUpdate={onTimeUpdate}
          onPlayStateChange={onPlayStateChange}
          onDurationChange={setDuration}
          selectedSegments={selectedSegments}
        />

        {currentData?.currentSentence && <TranscriptOverlay text={currentData.currentSentence.text} isVisible={true} />}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <Timeline
          duration={duration}
          currentTime={currentTime}
          selectedSegments={selectedSegments}
          onSeek={onTimeUpdate}
        />
      </div>
    </div>
  )
}
