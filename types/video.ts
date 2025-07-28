export interface TranscriptSentence {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isHighlight: boolean;
}

export interface TranscriptSection {
  title: string;
  sentences: TranscriptSentence[];
}

export interface VideoData {
  fullTranscript: string;
  sections: TranscriptSection[];
  duration: number;
  suggestedHighlights: string[];
}

export interface SelectedSegment {
  startTime: number;
  endTime: number;
  text: string;
  sentences: TranscriptSentence[];
}
