
export interface Resume {
  id?: string;
  name: string;
  jobTitle: string;
  yearsOfExperience: number;
  industries: string[];
  skills: string[];
  summary: string;
  contactInfo: {
    phone: string;
    email: string;
    linkedin: string;
  };
  workExperiences: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: Certification[];
  additionalSkills?: string[];
  softSkills?: SoftSkill[];
  markdownContent?: string; // Added for markdown content
  // Adding file_path property to match usage in resumeUtils.ts
  file_path?: string;
  isPrimary?: boolean;
  created_at?: string;
  updated_at?: string;
  uploadDate?: string | Date;
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  subSections?: SubSection[];
}

export interface SubSection {
  title: string;
  details: string[] | Project[];
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  // Add field property to match usage in resume-data.ts
  field?: string;
}

export interface Project {
  title: string;
  date: string;
  description: string;
  role?: string;
  impact?: string;
  technologies?: string[];
}

export interface Certification {
  name: string;
  dateRange: string;
}

export interface SoftSkill {
  name: string;
  description: string;
}

// Add ProjectDetail type that's referenced in generatePDF.ts
export type ProjectDetail = string | {
  title?: string;
  role?: string;
  description?: string;
};

export interface MatchInfo {
  score: number;
  reason: string;
  type: 'low' | 'medium' | 'high';
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
