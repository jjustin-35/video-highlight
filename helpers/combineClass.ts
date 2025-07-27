import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const combineClass = (...inputs: ClassValue[]) =>
  twMerge(clsx(inputs));
