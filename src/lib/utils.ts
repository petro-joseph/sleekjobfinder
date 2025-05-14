import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a value to a string, handling undefined and null values
 */
export function safeToString(value: any): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

/**
 * Checks if a value is a valid non-empty array
 */
export function isValidArray(value: any): boolean {
  return Array.isArray(value) && value.length > 0;
}
