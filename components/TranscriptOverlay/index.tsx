"use client";

import { combineClass } from "@/helpers/combineClass";
import { useVideoEditor } from "@/contexts/videoContext";

const TranscriptOverlay = () => {
  const { videoData, currentTime } = useVideoEditor();
  const allSentences = videoData?.sections.flatMap(
    (section) => section.sentences
  );
  const currentSentence = allSentences?.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  );
  const isHighlight = currentSentence?.isHighlight || false;

  if (!currentSentence?.text) return null;

  return (
    <div className="flex justify-center">
      <div className="bg-gray-700/80 px-4 py-2 rounded-lg text-center w-full mx-auto">
        <p
          className={combineClass(
            "text-lg leading-relaxed",
            isHighlight ? "text-green-500" : "text-white"
          )}
        >
          {currentSentence.text}
        </p>
      </div>
    </div>
  );
};

export default TranscriptOverlay;
