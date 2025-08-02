"use client";

import { combineClass } from "@/helpers/combineClass";

interface TranscriptOverlayProps {
  text: string;
  isHighlight: boolean;
}

const TranscriptOverlay = ({ text, isHighlight }: TranscriptOverlayProps) => {
  if (!text) return null;

  return (
    <div className="absolute bottom-12 left-4 right-4 flex justify-center">
      <div className="bg-black/80 px-4 py-2 rounded-lg max-w-2xl text-center">
        <p
          className={combineClass(
            "text-sm leading-relaxed",
            isHighlight ? "text-green-500" : "text-white"
          )}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default TranscriptOverlay;