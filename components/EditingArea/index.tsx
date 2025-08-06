"use client";

import { useEffect, useRef } from "react";
import { useVideoEditor } from "@/contexts/videoContext";
import Sentence from "./sentence";

const EditingArea = () => {
  const {
    videoData,
    selectedSentences,
    currentTime,
    handleSentenceToggle,
    handleTimestampClick,
  } = useVideoEditor();
  const currentSentenceRef = useRef<HTMLDivElement>(null);
  const suggestedSentences = videoData?.sections.flatMap((section) =>
    section.sentences.filter((sentence) => sentence.isHighlight)
  );

  // Auto-scroll to current sentence during playback
  useEffect(() => {
    if (currentSentenceRef.current) {
      currentSentenceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime]);

  if (!videoData) return null;

  return (
    <section className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Transcript & Highlights
        </h2>
        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
          <span>{selectedSentences.size} selected</span>
          <span>{suggestedSentences?.length} AI suggested</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {videoData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3 p-4">
            <h3 className="text-lg font-semibold text-gray-900 sticky top-0 bg-white py-2 border-b">
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.sentences.map((sentence) => {
                return (
                  <Sentence
                    key={sentence.id}
                    sentence={sentence}
                    selectedSentences={selectedSentences}
                    currentTime={currentTime}
                    currentSentenceRef={currentSentenceRef}
                    onSentenceToggle={handleSentenceToggle}
                    onTimestampClick={handleTimestampClick}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EditingArea;
