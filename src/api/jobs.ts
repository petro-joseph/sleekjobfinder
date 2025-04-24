
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/data/jobs";

export interface JobFilters {
  industry?: string;
  jobTypes?: string[];
  experienceLevels?: string[];
  location?: string;
  salaryRange?: [number, number];
  searchTerm?: string;
  sortBy?: 'newest' | 'relevant';
  featured?: boolean;
}

export const fetchJobs = async (filters?: JobFilters): Promise<Job[]> => {
  let query = supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });

  // Add filters if provided
  if (filters) {
    if (filters.industry) query = query.eq("industry", filters.industry);
    
    // Job Types filter
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      query = query.in("type", filters.jobTypes);
    }

    // Experience Levels (assuming there's a way to map this in the jobs table)
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      // You might need to adjust this based on how experience levels are stored in your jobs table
      query = query.in("experience_level", filters.experienceLevels);
    }

    // Location filter
    if (filters.location) query = query.ilike("location", `%${filters.location}%`);

    // Salary Range filter
    if (filters.salaryRange) {
      const [min, max] = filters.salaryRange;
      query = query.gte("salary", min.toString())
               .lte("salary", max.toString());
    }

    // Search Term filter
    if (filters.searchTerm) {
      query = query.or(
        `title.ilike.%${filters.searchTerm}%,` +
        `company.ilike.%${filters.searchTerm}%,` +
        `description.ilike.%${filters.searchTerm}%`
      );
    }
    
    // Featured filter
    if (filters.featured === true) {
      query = query.eq("featured", true);
    }
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Transform data to match Job interface expectations
  const transformedData = data.map(job => ({
    ...job,
    postedAt: formatPostedDate(job.posted_at)
  })) as Job[];

  // Sort jobs to show featured jobs first
  transformedData.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return transformedData;
};

// Helper function to format the posted_at date into a human-readable string
function formatPostedDate(postedAt: string): string {
  if (!postedAt) return "";
  
  const postedDate = new Date(postedAt);
  const now = new Date();
  const diffMs = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
}

export const fetchJobById = async (jobId: string): Promise<Job | null> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();
  
  if (error) throw new Error(error.message);
  
  if (!data) return null;
  
  // Transform to match Job interface
  return {
    ...data,
    postedAt: formatPostedDate(data.posted_at)
  } as Job;
};
