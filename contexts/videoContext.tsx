"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { VideoData, SelectedSegment } from "@/types/video";
import { mockAIProcess } from "@/lib/mockAi";

interface VideoContextType {
  // State
  videoFile: File | null;
  videoUrl: string;
  videoData: VideoData | null;
  isProcessing: boolean;
  selectedSentences: Set<string>;
  currentTime: number;
  isPlaying: boolean;

  // Actions
  handleVideoUpload: (file: File) => Promise<void>;
  handleSentenceToggle: (sentenceId: string) => void;
  handleTimestampClick: (timestamp: number) => void;
  getSelectedSegments: () => SelectedSegment[];
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const initialState: VideoContextType = {
  videoFile: null,
  videoUrl: "",
  videoData: null,
  isProcessing: false,
  selectedSentences: new Set(),
  currentTime: 0,
  isPlaying: false,
  handleVideoUpload: async () => {},
  handleSentenceToggle: () => {},
  handleTimestampClick: () => {},
  getSelectedSegments: () => [],
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
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoUpload = async (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    setIsProcessing(true);
    try {
      const processedData = await mockAIProcess();
      setVideoData(processedData);

      const suggestedIds = new Set<string>();
      processedData.sections.forEach((section) => {
        section.sentences.forEach((sentence) => {
          if (sentence.isHighlight) {
            suggestedIds.add(sentence.id);
          }
        });
      });
      setSelectedSentences(suggestedIds);
    } catch (error) {
      console.error("Error processing video:", error);
    } finally {
      setIsProcessing(false);
    }
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

  const getSelectedSegments = (): SelectedSegment[] => {
    if (!videoData) return [];

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
              text: sentence.text,
              sentences: [sentence],
            };
          } else {
            // Extend current segment
            currentSegment.endTime = sentence.endTime;
            currentSegment.text += " " + sentence.text;
            currentSegment.sentences.push(sentence);
          }
        }
      });
    });

    if (currentSegment) segments.push(currentSegment);
    return segments;
  };

  const value: VideoContextType = {
    // State
    videoFile,
    videoUrl,
    videoData,
    isProcessing,
    selectedSentences,
    currentTime,
    isPlaying,

    // Actions
    handleVideoUpload,
    handleSentenceToggle,
    handleTimestampClick,
    getSelectedSegments,
    setCurrentTime,
    setIsPlaying,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoProvider;