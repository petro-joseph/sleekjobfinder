
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely gets a property from an object that might be undefined or null.
 * Used to prevent "object as a React child" errors.
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  if (!obj) return undefined;
  return obj[key];
}

/**
 * Checks if a value is an array and has items
 */
export function isValidArray<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Safely converts any value to a string representation
 */
export function safeToString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  if (Array.isArray(value)) return value.map(safeToString).join(', ');
  if (typeof value === 'object') {
    // Convert object to string but warn in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Attempted to convert object directly to string:', value);
    }
    return '[Object]'; // Safe representation
  }
  return String(value);
}
