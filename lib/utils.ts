import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SentimentLabel } from "@/types/movie";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function normalizeSentimentLabel(value: string): SentimentLabel {
  const lower = value.trim().toLowerCase();
  if (lower === "positive" || lower === "negative" || lower === "mixed") {
    return lower;
  }
  return "mixed";
}
