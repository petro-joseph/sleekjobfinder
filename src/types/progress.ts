
/**
 * Type definitions for the Progress page components
 */

export const APPLICATION_STATUSES = ['applied', 'interview', 'offer_received', 'rejected', 'archived'] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export interface Application {
  id: string;
  job_id: string | null;
  user_id: string;
  position: string;
  company: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface JobAlert {
  id: string;
  user_id: string;
  query: string;
  keywords: string[] | null;
  location: string | null;
  frequency: string;
  created_at: string;
}
