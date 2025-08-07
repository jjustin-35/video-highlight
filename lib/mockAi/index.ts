import type { VideoData } from "@/types/video";
import mockData from "./data";

export async function mockAIProcess(): Promise<VideoData> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const allSentences = mockData.flatMap((section) => section.sentences);
  const duration = allSentences.reduce(
    (time, sentence) => time + (sentence.endTime - sentence.startTime),
    0
  );

  return {
    sections: mockData,
    duration,
    suggestedHighlights: mockData.flatMap((section) =>
      section.sentences.filter((s) => s.isHighlight).map((s) => s.id)
    ),
  };
}
