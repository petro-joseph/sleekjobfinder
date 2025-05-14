
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe string conversion utility
export function safeToString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

// Safe array check utility
export function isValidArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

// Helper to format project details
export function formatDetail(detail: string | { title?: string; role?: string; description?: string }): string {
  if (typeof detail === 'string') {
    return detail;
  }
  
  let result = '';
  if (detail.title) result += detail.title;
  if (detail.role) result += result ? ` - ${detail.role}` : detail.role;
  if (detail.description && !result.includes(detail.description)) {
    result += result ? `: ${detail.description}` : detail.description;
  }
  
  return result || '';
}
