import { supabase } from '@/integrations/supabase/client';
import { Job, JobSearchResponse } from '@/types';

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
  limit?: number;
}

export const fetchJobs = async (filters: Partial<JobFilters> = {}): Promise<JobSearchResponse> => {
  console.log('[fetchJobs] Received Filters:', filters); // Log incoming filters

  // Start building the query
  let query = supabase.from('jobs').select('*', { count: 'exact' });

  // Apply filters if they exist
  if (filters.industry) {
    query = query.ilike('industry', `%${filters.industry}%`);
  }

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  if (filters.featured) {
    query = query.eq('featured', true);
  }

  if (filters.jobTypes && filters.jobTypes.length > 0) {
    query = query.in('type', filters.jobTypes);
  }

  // Apply date posted filter
  if (filters.datePosted && filters.datePosted !== 'any') {
    const now = new Date();
    let cutoffDate: Date;

    switch (filters.datePosted) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '14d':
        cutoffDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        // Handle unexpected values or default to no date filter if needed
        // Setting cutoffDate to null or undefined might be better, but for gte,
        // using a very old date works to effectively disable the lower bound.
        cutoffDate = new Date(0);
        break;
    }
    // Ensure we have a valid date before applying the filter
    if (cutoffDate.getTime() > 0) {
      const cutoffISO = cutoffDate.toISOString();
      console.log(`[fetchJobs] Applying date filter: posted_at >= ${cutoffISO}`); // Log the applied filter
      query = query.gte('posted_at', cutoffISO);
    } else {
       console.log('[fetchJobs] Skipping date filter due to invalid cutoffDate.'); // Log if skipped
    }
  } else {
     console.log("[fetchJobs] Skipping date filter (not requested or 'any')."); // Use double quotes for the log string
  }


  // Add sorting
  if (filters.sortBy === 'newest') {
    // If datePosted filter is active, sorting by posted_at makes sense.
    // Otherwise, you might want a different default sort.
    query = query.order('posted_at', { ascending: false });
  } else {
    // For 'relevant' sorting, we could implement more complex logic here
    // For now, default sort includes featured then newest
    query = query.order('featured', { ascending: false }).order('posted_at', { ascending: false });
  }

  // Handle pagination
  const limit = filters.limit || 10;
  const page = filters.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Execute the query
  const { data: jobs, error, count } = await query.range(from, to);

  if (error) {
    console.error('[fetchJobs] Error fetching jobs:', error);
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  console.log('[fetchJobs] Raw jobs data received:', jobs); // Log the raw data

  // Process jobs to match the expected format
  const processedJobs = jobs.map(job => {
     const formattedDate = formatPostedAt(job.posted_at || job.created_at);
     console.log(`[fetchJobs] Processing job ${job.id}: raw posted_at=${job.posted_at}, raw created_at=${job.created_at}, formatted=${formattedDate}`); // Log processing
     return {
        ...job,
        postedAt: formattedDate,
        requirements: job.requirements || [],
        tags: job.tags || [],
     };
  });

  return {
    jobs: processedJobs,
    total: count || processedJobs.length,
    hasMore: count ? (from + limit) < count : false,
    nextPage: (from + limit) < (count || 0) ? page + 1 : undefined
  };
};

export const fetchJobById = async (jobId: string): Promise<Job | null> => {
  console.log('Fetching job with ID:', jobId);

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Error fetching job by id:', error);
    if (error.code === 'PGRST116') {
      // Record not found
      return null;
    }
    throw new Error(`Failed to fetch job: ${error.message}`);
  }

  if (!job) return null;

  return {
    ...job,
    postedAt: formatPostedAt(job.posted_at || job.created_at),
    requirements: job.requirements || [],
    tags: job.tags || []
  };
};

export const createJob = async (jobData: Omit<Job, 'id' | 'postedAt' | 'created_at'>): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return {
    ...data,
    postedAt: formatPostedAt(data.posted_at || data.created_at),
    requirements: data.requirements || [],
    tags: data.tags || []
  };
};

export const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error updating job:', error);
    throw new Error(`Failed to update job: ${error.message}`);
  }

  return {
    ...data,
    postedAt: formatPostedAt(data.posted_at || data.created_at),
    requirements: data.requirements || [],
    tags: data.tags || []
  };
};

export const deleteJob = async (jobId: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) {
    console.error('Error deleting job:', error);
    throw new Error(`Failed to delete job: ${error.message}`);
  }
};

const formatPostedAt = (dateString: string): string => {
  console.log(`[formatPostedAt] Formatting date string: ${dateString}`); // Log input to formatter
  if (!dateString) return 'N/A'; // Handle null or undefined dates
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
     console.warn(`[formatPostedAt] Invalid Date encountered: ${dateString}`); // Log invalid dates
     return 'Invalid Date';
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return 'Future'; // Handle future dates if necessary
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
};
