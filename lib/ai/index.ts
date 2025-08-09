"use server";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  GenerateContentParameters,
  UploadFileParameters,
} from "@google/genai";
import type { ApiResponse } from "@/types/global";
import type { TranscriptSection, VideoData } from "@/types/video";
import { timeoutMs } from "@/constants/video";
import validateFile, { handleFileName } from "@/helpers/validateFile";
import retry from "@/helpers/retry";
import { videoAnalysisPrompt } from "./data";

// Initialize Gemini AI with retry logic
let genAI: GoogleGenAI | null = null;

const initializeGeminiAI = async (): Promise<GoogleGenAI> => {
  if (genAI) return genAI;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key not configured. Please check your environment variables."
    );
  }

  try {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    return genAI;
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    throw new Error(
      "Failed to initialize Gemini AI. Please check your API key."
    );
  }
};

export async function processVideoWithAI(
  file: File | string
): Promise<ApiResponse<VideoData>> {
  try {
    const genAI = await initializeGeminiAI();
    let uploadOptions: UploadFileParameters;
    let fileName = "";

    if (typeof file !== "string") {
      const validation = validateFile(file);
      if (!validation.isValid) {
        return {
          isSuccess: false,
          errorCode: 400,
          errorMessage: validation.error || "file validation failed",
        };
      }

      fileName = handleFileName(file.name);
      uploadOptions = {
        file: file,
        config: {
          mimeType: file.type,
          name: fileName,
        },
      };
    } else {
      fileName = handleFileName(file.split("/").pop() || "");
      console.log(fileName);
      uploadOptions = {
        file: file,
        config: {
          mimeType: "video/mp4",
          name: fileName,
        },
      };
    }

    const fetchedFile = await genAI.files.get({
      name: fileName,
    });

    if (!fetchedFile) {
      const uploadedPromise = retry(() => genAI.files.upload(uploadOptions));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("upload timeout, please try a smaller file")),
          timeoutMs
        )
      );
      const uploadedFile = await Promise.race([
        uploadedPromise,
        timeoutPromise,
      ]);

      if (!uploadedFile) {
        throw new Error("Failed to upload file.");
      }
    }

    const aiRequest: GenerateContentParameters = {
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(fetchedFile.uri || "", fetchedFile.mimeType || ""),
        videoAnalysisPrompt,
      ]),
    };

    const response = await genAI.models.generateContent(aiRequest);

    const text = response.text || "";

    // Parse the JSON response
    let parsedData;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    console.log(text);
    parsedData = JSON.parse(jsonMatch[0]);

    if (!parsedData.sections || !Array.isArray(parsedData.sections)) {
      throw new Error("Invalid response structure: missing sections array");
    }

    // Generate suggested highlights array
    const suggestedHighlights = parsedData.sections.flatMap(
      (section: TranscriptSection) =>
        section.sentences.filter((s) => s.isHighlight).map((s) => s.id)
    );

    return {
      isSuccess: true,
      data: {
        sections: parsedData.sections,
        duration: parsedData.duration || 0,
        suggestedHighlights,
      },
    };
  } catch (error) {
    if (genAI) {
      genAI.files.delete({ name: (file as any).name || "" });
    }
    console.error("Error processing video with Gemini:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      if (error.message.includes("timeout") || error.message.includes("超時")) {
        errorMessage = "Processing timeout, please try a smaller file or later";
      } else if (
        error.message.includes("quota") ||
        error.message.includes("limit")
      ) {
        errorMessage = "API quota exceeded, please try later";
      } else if (error.message.includes("API key")) {
        errorMessage =
          "API key configuration error, please check environment variables";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Network connection error, please check network connection";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      isSuccess: false,
      errorCode: 400,
      errorMessage: `Failed to process video: ${errorMessage}`,
    };
  }
}
