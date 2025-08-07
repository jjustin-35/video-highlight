import { cva } from "class-variance-authority";

export const sentenceVariants = cva(
  "p-4 rounded-lg border-2 transition-all cursor-pointer scroll-mt-60 lg:scroll-mt-0 landscape:scroll-mt-0",
  {
    variants: {
      isCurrent: {
        true: "bg-blue-50 border-blue-200 shadow-md",
      },
      isSelected: {
        true: "bg-green-50 border-green-200 border-2",
        false: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      },
    },
  }
);
