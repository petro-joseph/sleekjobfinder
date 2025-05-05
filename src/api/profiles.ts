
// src/api/profiles.ts
import { supabase } from '@/integrations/supabase/client';

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
  job_preferences?: JobPreferences;
  settings?: NotificationSettings;
  // Added these fields to match DbProfile
  created_at?: string;
  updated_at?: string;
  is_email_verified?: boolean;
}

export interface JobPreferences {
  locations: string[];
  job_types: string[];
  industries: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface NotificationSettings {
  notifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
}

export const fetchUserProfile = async (userId: string): Promise<ProfileData> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) throw new Error(error.message);
    
    // Cast any JSON fields to the proper types
    return {
        ...data,
        job_preferences: data.job_preferences as unknown as JobPreferences,
        settings: data.settings as unknown as NotificationSettings
    } as ProfileData;
};

export const updateUserProfile = async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
    // Create a new object that will be properly typed for Supabase
    const supabaseData: any = { ...profileData };
    
    const { data, error } = await supabase
        .from('profiles')
        .update(supabaseData)
        .eq('id', userId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    
    // Cast any JSON fields to the proper types
    return {
        ...data,
        job_preferences: data.job_preferences as unknown as JobPreferences,
        settings: data.settings as unknown as NotificationSettings
    } as ProfileData;
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

export const updateUserPreferences = async (
  userId: string, 
  jobPreferences: JobPreferences, 
  settings: NotificationSettings,
  isComplete: boolean = false
): Promise<ProfileData> => {
  // Create a properly typed object for Supabase
  const updates: any = {
    job_preferences: jobPreferences,
    settings: settings
  };

  // Only set onboarding complete if specified
  if (isComplete) {
    updates.onboarding_step = 3;
    updates.is_onboarding_complete = true;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  // Cast any JSON fields to the proper types
  return {
    ...data,
    job_preferences: data.job_preferences as unknown as JobPreferences,
    settings: data.settings as unknown as NotificationSettings
  } as ProfileData;
};
