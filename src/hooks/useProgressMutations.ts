
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ApplicationStatus } from "@/types/progress";
import { formatStatusLabel } from "@/utils/progressHelpers";

export const useProgressMutations = (userId?: string) => {
  const queryClient = useQueryClient();

  const commonMutationOptions = {
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
      console.error("Mutation Error:", error);
    },
  };

  // Application mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase.from('applications').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications', userId] });
      toast.success(`Application status updated to ${formatStatusLabel(variables.status)}`);
    },
    ...commonMutationOptions,
  });

  // Job alerts mutations
  const createAlertMutation = useMutation({
    mutationFn: async ({ query, location, frequency }: { query: string; location: string; frequency: string }) => {
      if (!userId) throw new Error("User not authenticated");
      const keywordsArray = query.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const { data, error } = await supabase
        .from('job_alerts')
        .insert({
          user_id: userId,
          query: query,
          keywords: keywordsArray.length > 0 ? keywordsArray : null,
          location: location || null,
          frequency: frequency,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_alerts', userId] });
      toast.success('Job alert created successfully');
    },
    ...commonMutationOptions,
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      if (!userId) throw new Error("User not authenticated");
      const { error } = await supabase.from('job_alerts').delete().eq('id', alertId).eq('user_id', userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_alerts', userId] });
      toast.success('Job alert deleted');
    },
    ...commonMutationOptions,
  });

  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, frequency }: { id: string; frequency: string }) => {
      if (!userId) throw new Error("User not authenticated");
      const { error } = await supabase.from('job_alerts').update({ frequency }).eq('id', id).eq('user_id', userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job_alerts', userId] });
      toast.success(`Alert frequency updated to ${variables.frequency}`);
    },
    ...commonMutationOptions,
  });

  return {
    updateStatusMutation,
    createAlertMutation,
    deleteAlertMutation,
    updateAlertMutation
  };
};
