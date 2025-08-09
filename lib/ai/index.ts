"use server";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  GenerateContentParameters,
} from "@google/genai";
import type { ApiResponse } from "@/types/global";
import type { TranscriptSection, VideoData } from "@/types/video";
import { videoAnalysisPrompt } from "./data";

// Initialize Gemini AI
let genAI: GoogleGenAI | null = null;
try {
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
} catch (error) {
  console.error("Failed to initialize Gemini AI:", error);
}

export async function processVideoWithAI(file: File): Promise<
  ApiResponse<VideoData>
> {
  try {
    if (!genAI) {
      throw new Error("Gemini AI not initialized. Please check your API key.");
    }

    const uploadedFile = await genAI.files.upload({
      file: file,
      config: {
        mimeType: file.type,
        name: file.name,
      },
    });

    const fetchedFile = await genAI.files.get({
      name: uploadedFile.name || "",
    });
    if (!fetchedFile) {
      throw new Error("Failed to upload file.");
    }

    const aiRequest: GenerateContentParameters = {
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(uploadedFile.uri || "", uploadedFile.mimeType || ""),
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
    console.error("Error processing video with Gemini:", error);
    return {
      isSuccess: false,
      errorCode: 400,
      errorMessage: `Failed to process video: ${
        (error as Error)?.message || "Unknown error"
      }`,
    };
  }
}
