"use client";

import { useVideoEditor } from "@/contexts/videoContext";
import VideoUpload from "@/components/VideoUpload";
import EditingArea from "@/components/EditingArea";
import PreviewArea from "@/components/PreviewArea";
import Loading from "./loading";

const VideoHighlightEditor = () => {
  const { videoFile, isProcessing } = useVideoEditor();

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
    <div className="max-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Video Highlight Editor
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row-reverse lg:h-[calc(100vh-64px)] lg:overflow-hidden landscape:flex-row-reverse landscape:h-[calc(100vh-64px)] landscape:overflow-hidden">
        <div className="w-full lg:w-3/5 landscape:w-3/5 bg-gray-900 sticky top-0 z-10 lg:static">
          <PreviewArea />
        </div>
        <div className="w-full h-full lg:w-2/5 landscape:w-2/5 border-t lg:border-t-0 border-r bg-white overflow-y-auto">
          <EditingArea />
        </div>
      </div>
    </div>
  );
};

export default VideoHighlightEditor;
