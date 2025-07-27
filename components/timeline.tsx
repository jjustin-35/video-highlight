"use client"

import type React from "react"

import { useRef } from "react"
import type { SelectedSegment } from "@/types/video"

interface TimelineProps {
  duration: number
  currentTime: number
  selectedSegments: SelectedSegment[]
  onSeek: (time: number) => void
}

export function Timeline({ duration, currentTime, selectedSegments, onSeek }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || duration === 0) return

    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const time = percentage * duration

    onSeek(time)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div ref={timelineRef} className="relative h-6 bg-gray-700 rounded cursor-pointer" onClick={handleClick}>
        {/* Selected segments */}
        {selectedSegments.map((segment, index) => (
          <div
            key={index}
            className="absolute top-0 h-full bg-green-500 rounded"
            style={{
              left: `${(segment.startTime / duration) * 100}%`,
              width: `${((segment.endTime - segment.startTime) / duration) * 100}%`,
            }}
          />
        ))}

        {/* Current time indicator */}
        <div
          className="absolute top-0 w-0.5 h-full bg-white shadow-lg"
          style={{
            left: `${(currentTime / duration) * 100}%`,
          }}
        />

        {/* Playhead */}
        <div
          className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2"
          style={{
            left: `${(currentTime / duration) * 100}%`,
          }}
        />
      </div>

      <div className="text-xs text-gray-400 text-center">{selectedSegments.length} segments selected</div>
    </div>
  )
}
