"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { VideoData, SelectedSegment } from "@/types/video";
import { useToast } from "@/contexts/toastContext";
import { ToastType } from "@/constants/toast";
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
  isPlaying: boolean;

  // Actions
  handleVideoUpload: (file: File) => Promise<void>;
  handleDemoVideo: () => Promise<void>;
  handleSentenceToggle: (sentenceId: string) => void;
  handleTimestampClick: (timestamp: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const initialState: VideoContextType = {
  videoFile: null,
  videoUrl: "",
  videoData: null,
  isProcessing: false,
  selectedSentences: new Set(),
  selectedSegments: [],
  currentTime: 0,
  isPlaying: false,
  handleVideoUpload: async () => {},
  handleDemoVideo: async () => {},
  handleSentenceToggle: () => {},
  handleTimestampClick: () => {},
  setCurrentTime: () => {},
  setIsPlaying: () => {},
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
  const [isPlaying, setIsPlaying] = useState(false);
  const { openToast } = useToast();

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

  const handleAiData = async (file: File | string) => {
    setIsProcessing(true);
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
      resetVideo();
      openToast(ToastType.processingFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetVideo = () => {
    setVideoData(null);
    setVideoFile(null);
    setVideoUrl("");
  };

  const handleDemoVideo = async () => {
    const file = {
      name: "demo.mp4",
      type: "video/mp4",
      size: 1000000,
      lastModified: Date.now(),
    } as File;
    setVideoFile(file);

    const videoUrl = "/demo.mp4";
    const fileUrl = `./public/${videoUrl}`;
    setVideoUrl(videoUrl);
    await handleAiData(fileUrl);
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
    // Actions
    handleVideoUpload,
    handleDemoVideo,
    handleSentenceToggle,
    handleTimestampClick,
    setCurrentTime,
    setIsPlaying,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export default VideoProvider;
