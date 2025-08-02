"use client";

import VideoUpload from "@/components/VideoUpload";
import EditingArea from "@/components/EditingArea";
import PreviewArea from "@/components/PreviewArea";
import { useVideoEditor } from "@/contexts/videoContext";
import Loading from "./loading";

const VideoHighlightEditor = () => {
  const { videoFile, isProcessing, selectedSentences } = useVideoEditor();

  if (!videoFile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <VideoUpload />
      </div>
    );
  }

  if (isProcessing) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Video Highlight Editor
            </h1>
            <div className="text-sm text-gray-500">
              {videoFile.name} • {selectedSentences.size} highlights selected
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col-reverse sm:flex-row sm:h-[calc(100vh-80px)]">
        <div className="sticky top-[-111px] left-0 sm:static w-full sm:w-2/3 bg-gray-900">
          <PreviewArea />
        </div>
        <div className="w-full sm:w-1/3 border-r bg-white">
          <EditingArea />
        </div>
      </div>
    </div>
  );
};

export default VideoHighlightEditor;
