"use client";

import { useState } from "react";

import { useRef, useEffect } from "react";
import { TranscriptSentence } from "@/types/video";
import { useVideoEditor } from "@/contexts/videoContext";
import Timeline from "./timeline";
import TranscriptOverlay from "./transcriptOverlay";
import ControlBar from "./controlBar";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const {
    videoUrl,
    videoData,
    currentTime,
    isPlaying,
    selectedSegments,
    setCurrentTime,
    setIsPlaying,
  } = useVideoEditor();

  const currentSentence = videoData?.sections.reduce<TranscriptSentence | null>(
    (acc, section) => {
      const sentence = section.sentences.find(
        (s) => currentTime >= s.startTime && currentTime <= s.endTime
      );
      return sentence ? sentence : acc;
    },
    null
  );

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

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        playsInline
      />

      {currentSentence && (
        <TranscriptOverlay
          text={currentSentence.text}
          isHighlight={currentSentence.isHighlight}
        />
      )}

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
          handleFullscreen={handleFullscreen}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
