
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
  resumes?: Resume[];
  applications?: Application[];
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

export interface Resume {
  id: string;
  name: string;
  file_path: string;
  isPrimary: boolean;
  created_at: string;
  updated_at: string;
  uploadDate: string | Date;
  user_id?: string;
  contactInfo?: {
    phone: string;
    email: string;
    linkedin: string;
  };
  jobTitle?: string;
  yearsOfExperience?: number;
  industries?: string[];
  skills?: string[];
  summary?: string;
  workExperiences?: WorkExperience[];
  education?: Education[];
  projects?: Project[];
}

export interface WorkExperience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
  department?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  gpa?: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  title: string;
  date: string;
  description: string;
}

export interface Application {
  id: string;
  jobId?: string;
  job_id?: string;
  position: string;
  company: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'reviewed' | 'accepted' | 'archived' | 'offer_received';
  createdAt: string;
  updatedAt: string;
  appliedAt?: string;
  created_at?: string;
  updated_at?: string;
  applied_at?: string;
  user_id?: string;
}
