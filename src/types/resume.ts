
import { Resume as BaseResume, WorkExperience as BaseWorkExperience, Education } from '../types/index';

// Re-export the types from index.ts
export type { Education };

// Extended WorkExperience type with subSections
export interface WorkExperience extends BaseWorkExperience {
  subSections?: Array<{
    title: string;
    details: string[];
  }>;
}

// Define Project interface instead of importing it
export interface Project {
  title: string;
  date: string;
  description: string;
  role?: string;
}

// Extended Resume type with additional properties
export interface Resume extends Omit<BaseResume, 'workExperiences' | 'projects'> {
  workExperiences: WorkExperience[];
  projects?: Project[];
  certifications?: Array<{
    name: string;
    dateRange: string;
  }>;
  additionalSkills?: string[];
  softSkills?: Array<{
    name: string;
    description: string;
  }>;
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
