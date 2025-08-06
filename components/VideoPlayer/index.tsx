"use client";

import { useState } from "react";

import { useRef, useEffect } from "react";
import { useVideoEditor } from "@/contexts/videoContext";
import Timeline from "./timeline";
import ControlBar from "./controlBar";
import TranscriptOverlay from "../TranscriptOverlay";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const {
    videoUrl,
    currentTime,
    isPlaying,
    selectedSegments,
    setCurrentTime,
    setIsPlaying,
  } = useVideoEditor();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [setCurrentTime, setDuration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isPlaying) {
      video.pause();
      return;
    }

    video.play();
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = ([newVolume]: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <div className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full aspect-video object-contain"
        playsInline
        onClick={handlePlayPause}
      />

      <div className="hidden md:block absolute left-0 right-0 bottom-4 group-hover:bottom-16 p-4 transition-all duration-300">
        <TranscriptOverlay />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Timeline
          duration={duration}
          currentTime={currentTime}
          selectedSegments={selectedSegments}
          onTimeChange={setCurrentTime}
        />

        <ControlBar
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          handleVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
