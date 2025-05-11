
import { ApplicationStatus } from '@/types/progress';

/**
 * Format application status for display
 */
export const formatStatusLabel = (status: ApplicationStatus): string => {
  return status.charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
