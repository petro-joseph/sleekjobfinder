import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/data/jobs";
import { DateTime } from 'luxon';

export interface JobFilters {
  jobTypes: string[];
  experienceLevels: string[];
  salaryRange: [number, number];
  searchTerm: string;
  industry: string;
  location: string;
  sortBy: 'newest' | 'relevant';
  datePosted: string;
  featured?: boolean;
}

// Helper function to format posted_at date like Carbon's diffForHumans
function diffForHumans(postedAt: string): string {
  if (!postedAt) return '';
  const postedDate = DateTime.fromISO(postedAt);
  if (!postedDate.isValid) return '';
  return postedDate.toRelative() || '';
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
    // if (filters.experienceLevels && filters.experienceLevels.length > 0) {
    //   query = query.in("experience_level", filters.experienceLevels);
    // }

    // Location filter
    if (filters.location) query = query.ilike("location", `%${filters.location}%`);

    // Salary Range filter
    if (filters.salaryRange) {
      const [min, max] = filters.salaryRange;
      if (min > 0) query = query.gte("salary", min.toString());
      if (max > 0) query = query.lte("salary", max.toString());
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
    postedAt: diffForHumans(job.posted_at)
  })) as Job[];

  // Sort jobs to show featured jobs first
  transformedData.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return transformedData;
};

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
    postedAt: diffForHumans(data.posted_at)
  } as Job;
};