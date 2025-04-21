
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
  return data as Job[];
};

export const fetchJobById = async (jobId: string): Promise<Job | null> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Job | null;
};
