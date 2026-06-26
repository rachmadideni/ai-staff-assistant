import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

export function formatTokenCount(tokens: number) {
  if (tokens < 1000) return `${tokens} tokens`
  return `${(tokens / 1000).toFixed(1)}k tokens`
}
