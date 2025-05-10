
import { Resume as BaseResume, WorkExperience, Education, Project } from '../types/index';

// Re-export the types from index.ts
export type { WorkExperience, Education, Project };

// Extended Resume type with additional properties
export interface Resume extends BaseResume {
  certifications?: Array<{
    name: string;
    dateRange: string;
  }>;
  additionalSkills?: string[];
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
