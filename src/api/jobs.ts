
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/data/jobs"; // For type only

export const fetchJobs = async (filters?: any): Promise<Job[]> => {
  let query = supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });

  // Add filters if provided
  if (filters) {
    if (filters.industry) query = query.eq("industry", filters.industry);
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.searchTerm) query = query.ilike("title", `%${filters.searchTerm}%`);
    // Add more filter logic as needed...
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  
  // Transform data to match Job interface expectations
  return data.map(job => ({
    ...job,
    postedAt: formatPostedDate(job.posted_at) // Add postedAt property for UI components
  })) as Job[];
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
    postedAt: formatPostedDate(data.posted_at)
  } as Job;
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
