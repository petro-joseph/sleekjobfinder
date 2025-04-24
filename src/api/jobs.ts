
import { Job } from '@/types';

export interface JobFilters {
  jobTypes: string[];
  experienceLevels: string[];
  expLevels?: Record<string, boolean>; // Added for compatibility with JobsHeader
  salaryRange: [number, number];
  searchTerm: string;
  industry: string;
  location: string;
  sortBy: 'newest' | 'relevant';
  datePosted: string;
  featured?: boolean;
  page?: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  hasMore: boolean;
  nextPage?: number;
}

// Mock function to fetch jobs - in a real application this would call an API
export const fetchJobs = async (filters: Partial<JobFilters> = {}): Promise<JobSearchResponse> => {
  // This is a placeholder implementation - in a real app, you would call your API here
  console.log('Fetching jobs with filters:', filters);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Senior React Developer",
      company: "TechCorp",
      location: "Remote",
      salary: "$120K - $150K",
      type: "Full-time",
      description: "We're looking for a senior React developer to join our team.",
      requirements: ["5+ years experience", "React", "TypeScript"],
      postedAt: "2 days ago",
      featured: true,
      industry: "Technology",
      url: "/jobs/1",
      tags: ["React", "TypeScript", "Remote"]
    },
    {
      id: "2",
      title: "UX Designer",
      company: "DesignStudio",
      location: "San Francisco, CA",
      salary: "$90K - $110K",
      type: "Full-time",
      description: "Join our creative team as a UX Designer.",
      requirements: ["3+ years experience", "Figma", "User Research"],
      postedAt: "1 week ago",
      industry: "Design",
      url: "/jobs/2",
      tags: ["UX", "Figma", "Design"]
    }
  ];
  
  // Return response
  return {
    jobs: mockJobs,
    total: mockJobs.length,
    hasMore: false,
    nextPage: undefined
  };
};

export const fetchJobById = async (jobId: string): Promise<Job | null> => {
  // This is a placeholder implementation - in a real app, you would call your API here
  console.log('Fetching job with ID:', jobId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock job data
  const mockJob: Job = {
    id: jobId,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$120K - $150K",
    type: "Full-time",
    description: "We're looking for a senior React developer to join our team.",
    requirements: ["5+ years experience", "React", "TypeScript"],
    postedAt: "2 days ago",
    featured: true,
    industry: "Technology",
    url: `/jobs/${jobId}`,
    tags: ["React", "TypeScript", "Remote"]
  };
  
  return mockJob;
};
