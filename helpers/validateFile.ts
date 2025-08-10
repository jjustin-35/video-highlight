import {
  maxFileSizeBytes,
  allowedMimeTypes,
  maxFileSizeMB,
} from "@/constants/video";

export const handleFileName = (fileName: string) => {
  const newFileName = fileName
    .split(".")[0]
    .trim()
    .replace(" ", "-")
    .toLowerCase();
  return newFileName;
};

const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // size
  if (file.size > maxFileSizeBytes) {
    return {
      isValid: false,
      error: `file too large, max size is ${maxFileSizeMB}MB, your file is ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  // mime type
  if (!allowedMimeTypes.includes(file.type as any)) {
    return {
      isValid: false,
      error: `unsupported file format, supported formats: ${allowedMimeTypes.join(
        ", "
      )}`,
    };
  }

  // filename
  const filename = file.name;
  if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.length > 255) {
    return {
      isValid: false,
      error: "file name contains unsafe characters or is too long",
    };
  }

  return { isValid: true };
};

export default validateFile;
