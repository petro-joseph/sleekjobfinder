
// src/api/applications.ts
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types';

export const fetchApplications = async (userId: string): Promise<Application[]> => {
    const { data, error } = await supabase
        .from('applications')
        .select('id, user_id, job_id, position, company, status, created_at, updated_at, applied_at')
        .eq('user_id', userId)
        .order('applied_at', { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data as Application[];
};

export const fetchApplicationById = async (applicationId: string): Promise<Application | null> => {
    const { data, error } = await supabase
        .from('applications')
        .select('id, user_id, job_id, position, company, status, created_at, updated_at, applied_at')
        .eq('id', applicationId)
        .single();
    if (error) throw new Error(error.message);
    return data as Application;
};

export const createApplication = async (applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> => {
    const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as Application;
}

export const updateApplicationStatus = async (applicationId: string, status: string): Promise<Application> => {
    const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as Application;
}

export const updateApplication = async (applicationId: string, applicationData: Partial<Application>): Promise<Application> => {
    const { data, error } = await supabase
        .from('applications')
        .update(applicationData)
        .eq('id', applicationId)
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data as Application;
};

export const deleteApplication = async (applicationId: string): Promise<void> => {
    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);
    if (error) throw new Error(error.message);
};
