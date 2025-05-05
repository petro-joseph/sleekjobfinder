
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

export const createJobAlert = async (alertData: Omit<JobAlert, 'id' | 'created_at'>): Promise<JobAlert> => {
    const { data, error } = await supabase
        .from('job_alerts')
        .insert([alertData])
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as JobAlert;
};

export const updateJobAlert = async (alertId: string, alertData: Partial<JobAlert>): Promise<JobAlert> => {
    const { data, error } = await supabase
        .from('job_alerts')
        .update(alertData)
        .eq('id', alertId)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as JobAlert;
};

export const deleteJobAlert = async (alertId: string): Promise<void> => {
    const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', alertId);
    if (error) throw new Error(error.message);
};
