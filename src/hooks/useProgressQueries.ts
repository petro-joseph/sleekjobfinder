
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Application, JobAlert, ApplicationStatus, APPLICATION_STATUSES } from "@/types/progress";

export const useProgressQueries = (userId?: string) => {
  // Applications query
  const applicationsQuery = useQuery({
    queryKey: ['applications', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Application[];
    },
    enabled: !!userId,
  });

  // Job alerts query
  const jobAlertsQuery = useQuery({
    queryKey: ['job_alerts', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as JobAlert[];
    },
    enabled: !!userId,
  });

  // Helper function to count applications by status
  const getApplicationsCountByStatus = (applications: Application[] = []) => {
    return APPLICATION_STATUSES.reduce<Record<ApplicationStatus, number>>((acc, status) => {
      acc[status] = applications.filter(app => app.status === status).length;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
  };

  // Helper for filtered applications
  const getFilteredApplications = (applications: Application[] = [], filterStatus: ApplicationStatus | null) => {
    if (filterStatus === null) {
      return applications.filter(app => app.status !== 'archived');
    }
    return applications.filter(app => app.status === filterStatus);
  };

  return {
    applications: applicationsQuery.data || [],
    isApplicationsLoading: applicationsQuery.isLoading,
    jobAlerts: jobAlertsQuery.data || [],
    isJobAlertsLoading: jobAlertsQuery.isLoading,
    getApplicationsCountByStatus,
    getFilteredApplications,
    activeApplicationsCount: (applicationsQuery.data || []).filter(app => app.status !== 'archived').length,
  };
};
