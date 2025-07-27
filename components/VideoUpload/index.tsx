"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Video } from "lucide-react";
import { useVideoEditor } from "@/contexts/videoContext";
import { combineClass } from "@/helpers/combineClass";
import Button from "@/components/Button";

const VideoUpload = () => {
  const { handleVideoUpload } = useVideoEditor();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        handleVideoUpload(file);
      }
    },
    [handleVideoUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxFiles: 1,
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <Video className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Video Highlight Editor
        </h1>
        <p className="text-gray-600">
          Upload a video to create AI-powered highlight clips with transcripts
        </p>
      </div>

      <div
        {...getRootProps()}
        className={combineClass(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop your video here...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Drag and drop your video here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports MP4, MOV, AVI, WebM files
            </p>
            <Button>Choose Video File</Button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-gray-900 mb-1">AI Transcript</div>
            <div className="text-gray-600">
              Automatic speech-to-text with timestamps
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-gray-900 mb-1">
              Smart Highlights
            </div>
            <div className="text-gray-600">
              AI suggests the most important moments
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="font-medium text-gray-900 mb-1">Live Preview</div>
            <div className="text-gray-600">
              Real-time editing with transcript overlay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
