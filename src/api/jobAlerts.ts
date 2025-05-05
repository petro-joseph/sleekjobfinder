// src/api/jobAlerts.ts
import { supabase } from '@/integrations/supabase/client';
import { JobAlert } from '@/types';

export const fetchJobAlerts = async (userId: string): Promise<JobAlert[]> => {
    const { data, error } = await supabase
        .from('job_alerts')
        .select('id, user_id, query, keywords, location, frequency, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as JobAlert[];
};
