
export type { Resume, WorkExperience, Education, Project } from '../types/index';

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
