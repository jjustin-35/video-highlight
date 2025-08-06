"use client";

import { combineClass } from "@/helpers/combineClass";
import { useVideoEditor } from "@/contexts/videoContext";
import { TranscriptSentence } from "@/types/video";

const TranscriptOverlay = () => {
  const { videoData, currentTime } = useVideoEditor();
  const currentSentence = videoData?.sections.reduce<TranscriptSentence | null>(
    (acc, section) => {
      const sentence = section.sentences.find(
        (s) => currentTime >= s.startTime && currentTime <= s.endTime
      );
      return sentence ? sentence : acc;
    },
    null
  );
  const isHighlight = currentSentence?.isHighlight || false;

  return (
    <div className="flex justify-center">
      <div className="bg-gray-700/80 px-4 py-2 rounded-lg text-center w-full mx-auto">
        <p
          className={combineClass(
            "text-lg leading-relaxed",
            isHighlight ? "text-green-500" : "text-white"
          )}
        >
          {currentSentence?.text || ""}
        </p>
      </div>
    </div>
  );
};

export default TranscriptOverlay;