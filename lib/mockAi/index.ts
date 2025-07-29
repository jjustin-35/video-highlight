import type { VideoData } from "@/types/video";
import mockData from "./data";

export async function mockAIProcess(): Promise<VideoData> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const duration = mockData.reduce(
    (sectionDuration, section) =>
      sectionDuration +
      section.sentences.reduce(
        (sentenceDuration, sentence) =>
          sentenceDuration + sentence.endTime - sentence.startTime,
        0
      ),
    0
  );

  return {
    fullTranscript: mockData
      .flatMap((section) => section.sentences.map((s) => s.text))
      .join(" "),
    sections: mockData,
    duration,
    suggestedHighlights: mockData.flatMap((section) =>
      section.sentences.filter((s) => s.isHighlight).map((s) => s.id)
    ),
  };
}
