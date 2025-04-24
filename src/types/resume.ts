
export interface Resume {
  id: string;
  user_id?: string; // Make user_id optional if not always present in Zustand model
  name: string;
  file_path: string; // Path in Supabase storage
  isPrimary: boolean;
  created_at?: string; // Optional from DB
  updated_at?: string; // Optional from DB
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
  uploadDate?: string | Date; // Allow both string and Date
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

export interface JobPosting {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  requiredYearsOfExperience: number;
  industries: string[];
  requiredSkills: string[];
  description: string;
}

export interface MatchData {
  initialScore: number;
  finalScore: number;
  titleMatch: boolean;
  experienceMatch: boolean;
  industryMatches: string[];
  skillMatches: string[];
  missingSkills: string[];
  summaryMatch: boolean;
}
