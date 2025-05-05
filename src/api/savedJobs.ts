
// src/api/savedJobs.ts
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types';

export interface SavedJobRecord {
  id?: string;
  user_id: string;
  job_id: string;
  created_at?: string;
}

export const fetchSavedJobs = async (userId: string): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('job_id, jobs(*)')
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    if (!data) return [];
    
    return data.map((r: any) => r.jobs).filter((j: Job | null) => !!j);
};

export const saveJob = async (userId: string, jobId: string): Promise<SavedJobRecord> => {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({
        user_id: userId,
        job_id: jobId
      })
      .select()
      .single();
    
    if (error) {
      // Handle duplicate saved job
      if (error.code === '23505') {
        return { user_id: userId, job_id: jobId };
      }
      throw new Error(error.message);
    }
    
    return data as SavedJobRecord;
};

export const removeSavedJob = async (userId: string, jobId: string): Promise<void> => {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('job_id', jobId)
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
};

export const isSavedJob = async (userId: string, jobId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('job_id', jobId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return !!data;
};
