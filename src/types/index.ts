
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedAt: string;
  logo?: string;
  featured?: boolean;
  industry: string;
  url?: string;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isOnboardingComplete?: boolean;
  savedJobs: Job[];
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  hasMore: boolean;
  nextPage?: number;
}
