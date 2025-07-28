import { twMerge } from "tailwind-merge";

export const combineClass = (...inputs: string[]) => twMerge(inputs);
