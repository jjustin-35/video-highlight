"use client";

import { useVideoEditor } from "@/contexts/videoContext";
import VideoPlayer from "@/components/VideoPlayer";

const PreviewArea = () => {
  const { videoFile, selectedSentences } = useVideoEditor();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-black">
      <div className="flex flex-col h-full lg:h-auto">
        <div className="flex-1 relative lg:flex lg:items-center">
          <VideoPlayer />
        </div>
        <h2
          className="px-6 py-2 hidden lg:flex items-end gap-4 relative text-white text-2xl font-bold"
        >
          {videoFile?.name}
          <span className="text-sm text-gray-400">
            {selectedSentences.size} highlights
          </span>
        </h2>
      </div>
    </div>
  );
};

export default PreviewArea;
