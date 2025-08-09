"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Video, AlertCircle, Info } from "lucide-react";
import { useVideoEditor } from "@/contexts/videoContext";
import { combineClass } from "@/helpers/combineClass";
import validateFile from "@/helpers/validateFile";
import { maxFileSizeBytes, allowedExtensions, maxFileSizeMB } from "@/constants/video";
import Button from "@/components/Button";

const VideoUpload = () => {
  const { handleVideoUpload, handleDemoVideo, error: processError, clearError} = useVideoEditor();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const error = processError || uploadError;

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    clearError();
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        setUploadError(`file too large, max size is ${maxFileSizeMB}MB`);
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        setUploadError('unsupported file format, please select MP4, MOV, AVI or WebM files');
      } else {
        setUploadError('upload failed, please try again');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || 'upload failed, please try again');
        return;
      }
      handleVideoUpload(file);
    }
  };

  const onTryDemo = async () => {
    setUploadError(null);
    clearError();
    await handleDemoVideo();
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": allowedExtensions,
    },
    maxFiles: 1,
    maxSize: maxFileSizeBytes,
    noClick: true,
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

      {/* file limit message */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Upload limit</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Max file size: {maxFileSizeMB}MB</li>
              <li>Supported formats: {allowedExtensions.join(', ').toUpperCase()}</li>
              <li>Suggested video length: less than 30 minutes</li>
              <li>Processing time: 2-5 minutes (depends on file size)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Upload error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={combineClass(
          "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400 hover:border-gray-500"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop your video here...</p>
        ) : (
          <>
            <div>
              <p className="text-lg text-gray-600 mb-2">
                Drag and drop your video here, or click to select
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports {allowedExtensions.join(', ').toUpperCase()} files up to {maxFileSizeMB}MB
              </p>
              <Button variant="outline" onClick={open}>
                Choose Video File
              </Button>
            </div>
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm font-medium">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              <Button variant="outline" onClick={onTryDemo}>
                Try Demo
              </Button>
            </div>
          </>
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
