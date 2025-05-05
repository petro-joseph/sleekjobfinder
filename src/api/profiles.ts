
// src/api/profiles.ts
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export interface ProfileData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  skills?: string[];
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  title?: string;
  company?: string;
  onboarding_step?: number;
  is_onboarding_complete?: boolean;
}

export const fetchUserProfile = async (userId: string): Promise<ProfileData> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) throw new Error(error.message);
    return data;
};

export const updateUserProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
    const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
};

export const updateOnboardingStep = async (userId: string, step: number, isComplete: boolean = false): Promise<void> => {
    const { error } = await supabase
        .from('profiles')
        .update({ 
            onboarding_step: step,
            is_onboarding_complete: isComplete 
        })
        .eq('id', userId);
    
    if (error) throw new Error(error.message);
};
