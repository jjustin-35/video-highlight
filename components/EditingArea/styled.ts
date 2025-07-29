import { cva } from "class-variance-authority";

export const sentenceVariants = cva(
  "p-3 rounded-lg border transition-all cursor-pointer",
  {
    variants: {
      isCurrent: {
        true: "bg-blue-50 border-blue-200 shadow-sm",
      },
      isSelected: {
        true: "bg-green-50 border-green-200 border-2",
        false: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      },
    },
  }
);
