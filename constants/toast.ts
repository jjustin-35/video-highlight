export enum ToastType {
  uploadFailed = "uploadFailed",
  uploadSuccess = "uploadSuccess",
  uploadTimeout = "uploadTimeout",
  sizeLimit = "sizeLimit",
  typeLimit = "typeLimit",
  videoDuplicate = "videoDuplicate",
  videoNameInvalid = "videoNameInvalid",
  processingFailed = "processingFailed",
  processingSuccess = "processingSuccess",
  processingTimeout = "processingTimeout",
  aiError = "aiError",
  common = "common",
}

const toasts = {
  [ToastType.uploadFailed]: { message: "Video upload failed", type: "error" },
  [ToastType.uploadSuccess]: { message: "Video upload success", type: "success" },
  [ToastType.uploadTimeout]: { message: "Video upload timeout", type: "error" },
  [ToastType.sizeLimit]: { message: "Video reach the size limit", type: "error" },
  [ToastType.typeLimit]: { message: "Video type is not supported", type: "error" },
  [ToastType.videoDuplicate]: { message: "Video is already uploaded", type: "error" },
  [ToastType.videoNameInvalid]: { message: "Video name is invalid", type: "error" },
  [ToastType.processingFailed]: { message: "Video processing failed", type: "error" },
  [ToastType.processingSuccess]: { message: "Video processing success", type: "success" },
  [ToastType.processingTimeout]: { message: "Video processing timeout", type: "error" },
  [ToastType.aiError]: { message: "AI generation failed", type: "error" },
  [ToastType.common]: { message: "Something went wrong", type: "error" },
} as const;

export default toasts;
