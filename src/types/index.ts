
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
  tags: string[];
  posted_at?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isOnboardingComplete?: boolean;
  savedJobs: Job[];
  resumes?: any[];
  applications?: any[];
  skills?: string[];
  avatarUrl?: string;
  bio?: string;
  location?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  title?: string;
  company?: string;
  website?: string;
  onboardingStep?: number;
  jobPreferences?: {
    locations: string[];
    jobTypes: string[];
    industries: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
  };
  settings?: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  };
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  hasMore: boolean;
  nextPage?: number;
}
