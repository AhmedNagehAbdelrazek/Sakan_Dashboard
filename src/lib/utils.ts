import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_HOST = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");

export function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.startsWith(API_BASE_HOST)) {
      return `/api${url.slice(API_BASE_HOST.length)}`;
    }
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `/api${url}`;
  }
  return `${API_BASE_HOST}${url.startsWith("/") ? "" : "/"}${url}`;
}
