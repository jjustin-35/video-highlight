"use client"

import { useState } from "react"

import { useRef, useEffect } from "react"
import { Play, Pause, Volume2, Maximize } from "lucide-react"
import Button from "@/components/Button"
import { Slider } from "@/components/Slider"
import type { SelectedSegment } from "@/types/video"

interface VideoPlayerProps {
  src: string
  currentTime: number
  isPlaying: boolean
  onTimeUpdate: (time: number) => void
  onPlayStateChange: (playing: boolean) => void
  onDurationChange: (duration: number) => void
  selectedSegments: SelectedSegment[]
}

export function VideoPlayer({
  src,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onPlayStateChange,
  onDurationChange,
  selectedSegments,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      onDurationChange(video.duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [onTimeUpdate, onDurationChange])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime
    }
  }, [currentTime])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play()
    } else {
      video.pause()
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    onPlayStateChange(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <div className="relative w-full h-full bg-black group">
      <video ref={videoRef} src={src} className="w-full h-full object-contain" playsInline />

      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/20">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-2 text-white">
            <Volume2 className="w-4 h-4" />
            <Slider value={[volume]} onValueChange={handleVolumeChange} max={1} step={0.1} className="w-20" />
          </div>

          <div className="flex-1" />

          <Button variant="ghost" size="sm" onClick={handleFullscreen} className="text-white hover:bg-white/20">
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
