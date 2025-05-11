
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for efficiently fetching just the counts needed for dashboard stats
 * Uses direct COUNT queries instead of fetching entire arrays to improve performance
 */
export const useCountQueries = (userId: string | undefined) => {
  // Get active applications count (excluding archived)
  const activeApplicationsQuery = useQuery({
    queryKey: ['applications-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      // Use COUNT query directly instead of fetching all records
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('status', 'archived');
      
      if (error) {
        console.error('Error fetching applications count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes caching
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes after becoming unused
  });

  // Get job alerts count
  const jobAlertsQuery = useQuery({
    queryKey: ['job-alerts-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      // Use COUNT query directly instead of fetching all records
      const { count, error } = await supabase
        .from('job_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching job alerts count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes caching
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes after becoming unused
  });

  return {
    activeApplicationsCount: activeApplicationsQuery.data || 0,
    isLoadingApplications: activeApplicationsQuery.isLoading,
    jobAlertsCount: jobAlertsQuery.data || 0,
    isLoadingJobAlerts: jobAlertsQuery.isLoading
  };
};
