
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook for efficiently fetching counts of various user-related data
 * Uses optimized count queries without loading full data
 */
export const useCountQueries = (userId?: string) => {
  // Get active applications count (not loading all applications data)
  const { data: activeApplicationsCount = 0, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['applications-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching applications count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes caching
  });

  // Get job alerts count (not loading all alerts data)
  const { data: jobAlertsCount = 0, isLoading: isLoadingJobAlerts } = useQuery({
    queryKey: ['job-alerts-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
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
  });

  return {
    activeApplicationsCount,
    isLoadingApplications,
    jobAlertsCount,
    isLoadingJobAlerts
  };
};
