import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formateDateAgo = (date: string) => {
  if (!date) return "Unknown time";
  const createdDate = parseISO(date);
  return formatDistanceToNow(createdDate, { addSuffix: true })
}

export const formatDateInDDMMYYY = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB')
}

export const formatNumberStyle = (value: number): string => {
  if (value < 1_000) {
    return value.toString();
  } else if (value < 1_000_000) {
    return (value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace('.', ',') + 'K';
  } else if (value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace('.', ',') + 'M';
  } else {
    return (value / 1_000_000_000).toFixed(value >= 10_000_000_000 ? 0 : 1).replace('.', ',') + 'B';
  }
}

export const logTestFormData = (formData: FormData) => {
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File name = ${value.name}, size = ${value.size}, type = ${value.type}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
}

export const normalizeUrl = (url: string) => {
  if (!url) return ""; 
  return url.startsWith("http") ? url : `https://${url}`;
};