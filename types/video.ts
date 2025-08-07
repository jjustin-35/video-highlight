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
  sections: TranscriptSection[];
  duration: number;
  suggestedHighlights: string[];
}

export interface SelectedSegment {
  startTime: number;
  endTime: number;
  sentences: TranscriptSentence[];
}
