"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { VideoData, SelectedSegment } from "@/types/video";
import { processVideoWithAI } from "@/lib/ai";

interface VideoContextType {
  // State
  videoFile: File | null;
  videoUrl: string;
  videoData: VideoData | null;
  isProcessing: boolean;
  selectedSentences: Set<string>;
  selectedSegments: SelectedSegment[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  error: string | null;

  // Actions
  handleVideoUpload: (file: File) => Promise<void>;
  handleDemoVideo: () => Promise<void>;
  handleSentenceToggle: (sentenceId: string) => void;
  handleTimestampClick: (timestamp: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  clearError: () => void;
}

const initialState: VideoContextType = {
  videoFile: null,
  videoUrl: "",
  videoData: null,
  isProcessing: false,
  selectedSentences: new Set(),
  selectedSegments: [],
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  error: null,
  handleVideoUpload: async () => {},
  handleDemoVideo: async () => {},
  handleSentenceToggle: () => {},
  handleTimestampClick: () => {},
  setCurrentTime: () => {},
  setDuration: () => {},
  setIsPlaying: () => {},
  clearError: () => {},
};

const VideoContext = createContext<VideoContextType>(initialState);

export const useVideoEditor = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoEditor must be used within a VideoEditorProvider");
  }
  return context;
};

const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSentences, setSelectedSentences] = useState<Set<string>>(
    new Set()
  );
  const [selectedSegments, setSelectedSegments] = useState<SelectedSegment[]>(
    []
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoData) return;

    const segments: SelectedSegment[] = [];
    let currentSegment: SelectedSegment | null = null;

    videoData.sections.forEach((section) => {
      section.sentences.forEach((sentence) => {
        if (selectedSentences.has(sentence.id)) {
          if (
            !currentSegment ||
            sentence.startTime > currentSegment.endTime + 1
          ) {
            // Start new segment
            if (currentSegment) segments.push(currentSegment);
            currentSegment = {
              startTime: sentence.startTime,
              endTime: sentence.endTime,
              sentences: [sentence],
            };
          } else {
            // Extend current segment
            currentSegment.endTime = sentence.endTime;
            currentSegment.sentences.push(sentence);
          }
        }
      });
    });

    if (currentSegment) segments.push(currentSegment);
    setSelectedSegments(segments);
  }, [selectedSentences, videoData, currentTime]);

  useEffect(() => {
    if (!videoData || !duration) return;
    if (Math.abs(duration - videoData.duration) < 1) return;
    if (duration > videoData.duration) {
      setVideoData({
        ...videoData,
        duration,
      });
      return;
    }

    const newSections = videoData.sections.filter((section) => {
      return section.sentences.every(
        (sentence) => sentence.endTime <= duration
      );
    });
    const suggestedHighlights = newSections.flatMap((section) =>
      section.sentences.filter((s) => s.isHighlight).map((s) => s.id)
    );
    const newSelectedSentences = new Set(suggestedHighlights);

    const newVideoData = {
      ...videoData,
      duration,
      sections: newSections,
      suggestedHighlights,
    };
    setVideoData(newVideoData);
    setSelectedSentences(newSelectedSentences);
  }, [duration, videoData]);

  const handleAiData = async (file: File | string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const processedData = await processVideoWithAI(file);
      if (!processedData.isSuccess || !processedData.data) {
        throw new Error(
          processedData.errorMessage || "Failed to process video"
        );
      }
      const { data } = processedData;
      setVideoData(data);

      const suggestedIds = new Set(data.suggestedHighlights);
      setSelectedSentences(suggestedIds);
    } catch (error) {
      console.error("Error processing video:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Failed to process video: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleDemoVideo = async () => {
    const file = {
      name: "demo.mp4",
      type: "video/mp4",
      size: 1000000,
      lastModified: Date.now(),
    } as File;
    setVideoFile(file);
    const url = "./public/demo.mp4";
    setVideoUrl(url);
    await handleAiData(url);
  };

  const handleVideoUpload = async (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    await handleAiData(file);
  };

  const handleSentenceToggle = (sentenceId: string) => {
    const newSelected = new Set(selectedSentences);
    if (newSelected.has(sentenceId)) {
      newSelected.delete(sentenceId);
    } else {
      newSelected.add(sentenceId);
    }
    setSelectedSentences(newSelected);
  };

  const handleTimestampClick = (timestamp: number) => {
    setCurrentTime(timestamp);
  };

  const value: VideoContextType = {
    // State
    videoFile,
    videoUrl,
    videoData,
    isProcessing,
    selectedSentences,
    selectedSegments,
    currentTime,
    isPlaying,
    duration,
    error,
    // Actions
    handleVideoUpload,
    handleDemoVideo,
    handleSentenceToggle,
    handleTimestampClick,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    clearError,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export default VideoProvider;
