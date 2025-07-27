import { Clock, Sparkles } from "lucide-react";
import type { TranscriptSentence } from "@/types/video";
import { formatTime } from "@/helpers/formatTime";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { sentenceVariants } from "./styled";

interface SentenceProps {
  sentence: TranscriptSentence;
  selectedSentences: Set<string>;
  currentTime: number;
  currentSentenceRef: React.RefObject<HTMLDivElement>;
  onSentenceToggle: (sentenceId: string) => void;
  onTimestampClick: (timestamp: number) => void;
}

const Sentence = ({
  sentence,
  selectedSentences,
  currentTime,
  currentSentenceRef,
  onSentenceToggle,
  onTimestampClick,
}: SentenceProps) => {
  const isSelected = selectedSentences.has(sentence.id);
  const isCurrent = currentTime >= sentence.startTime && currentTime <= sentence.endTime;
  const sentenceStyles = sentenceVariants({
    isCurrent,
    isSelected,
  });
  const startTime = formatTime(sentence.startTime);

  return (
    <div
      key={sentence.id}
      ref={isCurrent ? currentSentenceRef : undefined}
      className={sentenceStyles}
      onClick={() => onSentenceToggle(sentence.id)}
    >
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-xs text-gray-500 hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onTimestampClick(sentence.startTime);
          }}
        >
          <Clock className="w-3 h-3 mr-1" />
          {startTime}
        </Button>

        <div className="flex-1">
          <p
            className={`text-sm leading-relaxed ${
              isCurrent ? "text-blue-900 font-medium" : "text-gray-700"
            }`}
          >
            {sentence.text}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {sentence.isHighlight && (
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Suggested
              </Badge>
            )}
            {isSelected && (
              <Badge className="text-xs bg-green-600">Selected</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sentence;
