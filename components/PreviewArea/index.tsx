"use client";

import VideoPlayer from "@/components/VideoPlayer";

const PreviewArea = () => {
  return (
    <div className="h-full flex flex-col bg-black">
      <div className="flex flex-col">
        <div className="flex-1 relative">
          <VideoPlayer />
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;
