import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job, Resume, Application } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  title?: string;
  company?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  applications: Application[];
  savedJobs: Job[];
  alerts: Alert[];
  resumes: Resume[];
  onboardingStep?: number;
  isOnboardingComplete?: boolean;
  jobPreferences?: {
    locations: string[];
    jobTypes: string[];
    industries: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
  };
  settings?: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  }
}

export interface DbProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  title?: string;
  company?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  skills?: string[];
  is_email_verified?: boolean;
  is_onboarding_complete?: boolean;
  onboarding_step?: number;
  settings?: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  };
  job_preferences?: {
    locations: string[];
    job_types: string[];
    industries: string[];
    salary_range?: {
      min: number;
      max: number;
    };
  };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Alert {
  id: string;
  query: string;
  keywords: string[];
  location?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  saveJob: (job: Job) => Promise<void>;
  removeJob: (jobId: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  fetchSavedJobs: () => Promise<Job[]>;
  fetchUserProfile: () => Promise<void>;
}

export function mapProfileToUser(profile: DbProfile, savedJobs: Job[] = [], resumes: Resume[] = [], applications: Application[] = []): User {
  return {
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || '',
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zip: profile.zip,
    country: profile.country,
    title: profile.title,
    company: profile.company,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    location: profile.location,
    website: profile.website,
    skills: profile.skills || [],
    applications,
    savedJobs,
    alerts: [],
    resumes,
    onboardingStep: profile.onboarding_step,
    isOnboardingComplete: profile.is_onboarding_complete,
    jobPreferences: profile.job_preferences ? {
      locations: profile.job_preferences.locations || [],
      jobTypes: profile.job_preferences.job_types || [],
      industries: profile.job_preferences.industries || [],
      salaryRange: profile.job_preferences.salary_range
    } : undefined,
    settings: profile.settings || {
      notifications: true,
      emailUpdates: false,
      darkMode: false,
    }
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        try {
          if (!password) {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              // We're already logged in, fetch the user profile
              await get().fetchUserProfile();
              return;
            }
          }

          if (email && password) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;

            if (data.user) {
              // Fetch additional user data after login
              await get().fetchUserProfile();
            }
          }
        } catch (error: any) {
          console.error("Login error:", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ isAuthenticated: false, user: null });
        } catch (error) {
          console.error("Error during logout:", error);
          throw error;
        }
      },
      register: async (userData) => {
        try {
          const { error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                first_name: userData.firstName,
                last_name: userData.lastName,
              },
              emailRedirectTo: `${window.location.origin}/verify-otp?email=${encodeURIComponent(userData.email)}`
            }
          });

          if (error) throw error;

          toast.success(
            "Please check your email to verify your account.",
            {
              description: "We've sent you a verification link.",
              duration: 5000,
            }
          );
        } catch (error: any) {
          console.error("Registration error:", error);
          throw error;
        }
      },
      fetchUserProfile: async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            set({ isAuthenticated: false, user: null });
            return;
          }
          
          // Fetch profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profileError) throw profileError;
          
          // If no profile exists yet, create a minimal one
          const userProfile = profile || {
            id: user.id,
            first_name: '',
            last_name: '',
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Fetch saved jobs
          const savedJobs = await get().fetchSavedJobs();
          
          // Fetch resumes
          const { data: resumes, error: resumesError } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', user.id);
            
          if (resumesError) throw resumesError;
          
          // Fetch applications
          const { data: applications, error: applicationsError } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', user.id);
            
          if (applicationsError) throw applicationsError;
          
          // Map DB formats to application format
          const formattedApplications: Application[] = applications?.map(app => ({
            id: app.id,
            jobId: app.job_id,
            position: app.position,
            company: app.company,
            status: app.status as Application['status'], // Type assertion to ensure compatibility
            createdAt: app.created_at,
            updatedAt: app.updated_at,
            appliedAt: app.applied_at
          })) || [];
          
          // Map to our User model
          const mappedUser = mapProfileToUser(
            userProfile, 
            savedJobs, 
            resumes?.map(r => ({
              id: r.id,
              name: r.name,
              file_path: r.file_path,
              isPrimary: r.is_primary,
              created_at: r.created_at,
              updated_at: r.updated_at,
              uploadDate: r.upload_date || r.created_at
            })) || [],
            formattedApplications
          );
          
          set({ isAuthenticated: true, user: mappedUser });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ isAuthenticated: false, user: null });
          throw error;
        }
      },
      fetchSavedJobs: async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) return [];
          
          const { data: savedJobsData, error: savedJobsError } = await supabase
            .from('saved_jobs')
            .select('job_id')
            .eq('user_id', user.id);
            
          if (savedJobsError) throw savedJobsError;
          
          if (!savedJobsData?.length) return [];
          
          // Get the full job details for each saved job
          const jobIds = savedJobsData.map(item => item.job_id);
          const { data: jobs, error: jobsError } = await supabase
            .from('jobs')
            .select('*')
            .in('id', jobIds);
            
          if (jobsError) throw jobsError;
          
          return jobs.map(job => ({
            ...job,
            postedAt: formatPostedAt(job.posted_at || job.created_at),
            requirements: job.requirements || [],
            tags: job.tags || []
          }));
          
        } catch (error) {
          console.error("Error fetching saved jobs:", error);
          return [];
        }
      },
      saveJob: async (job) => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) throw new Error('User not authenticated');
          
          // Check if job is already saved
          const { data: existingJob, error: checkError } = await supabase
            .from('saved_jobs')
            .select('*')
            .eq('user_id', user.id)
            .eq('job_id', job.id)
            .maybeSingle();
            
          if (checkError) throw checkError;
          
          if (existingJob) {
            toast.info("Job already saved");
            return;
          }
          
          const { error } = await supabase
            .from('saved_jobs')
            .insert([{ user_id: user.id, job_id: job.id }]);

          if (error) throw error;

          // Update local state
          const { user: currentUser } = get();
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                savedJobs: [...currentUser.savedJobs, job],
              }
            });
          }
          
          toast.success("Job saved successfully");
        } catch (error) {
          console.error('Error saving job:', error);
          toast.error("Failed to save job");
          throw error;
        }
      },
      removeJob: async (jobId) => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) throw new Error('User not authenticated');
          
          const { error } = await supabase
            .from('saved_jobs')
            .delete()
            .eq('job_id', jobId)
            .eq('user_id', user.id);

          if (error) throw error;

          // Update local state
          const { user: currentUser } = get();
          if (currentUser) {
            set({
              user: {
                ...currentUser,
                savedJobs: currentUser.savedJobs.filter((job) => job.id !== jobId),
              }
            });
          }
          
          toast.success("Job removed from saved list");
        } catch (error) {
          console.error('Error removing job:', error);
          toast.error("Failed to remove job");
          throw error;
        }
      },
      updateUser: async (userData) => {
        try {
          const { user: currentUser } = get();
          if (!currentUser) throw new Error('No user logged in');
          
          // Map from our UI model to DB model
          const dbData: any = {};
          
          if (userData.firstName !== undefined) dbData.first_name = userData.firstName;
          if (userData.lastName !== undefined) dbData.last_name = userData.lastName;
          if (userData.email !== undefined) dbData.email = userData.email;
          if (userData.phone !== undefined) dbData.phone = userData.phone;
          if (userData.address !== undefined) dbData.address = userData.address;
          if (userData.city !== undefined) dbData.city = userData.city;
          if (userData.state !== undefined) dbData.state = userData.state;
          if (userData.zip !== undefined) dbData.zip = userData.zip;
          if (userData.country !== undefined) dbData.country = userData.country;
          if (userData.title !== undefined) dbData.title = userData.title;
          if (userData.company !== undefined) dbData.company = userData.company;
          if (userData.bio !== undefined) dbData.bio = userData.bio;
          if (userData.avatarUrl !== undefined) dbData.avatar_url = userData.avatarUrl;
          if (userData.location !== undefined) dbData.location = userData.location;
          if (userData.website !== undefined) dbData.website = userData.website;
          if (userData.skills !== undefined) dbData.skills = userData.skills;
          if (userData.onboardingStep !== undefined) dbData.onboarding_step = userData.onboardingStep;
          if (userData.isOnboardingComplete !== undefined) dbData.is_onboarding_complete = userData.isOnboardingComplete;
          
          // Only update if we have data to update
          if (Object.keys(dbData).length > 0) {
            const { error } = await supabase
              .from('profiles')
              .update(dbData)
              .eq('id', currentUser.id);
              
            if (error) throw error;
          }
          
          // Update local state
          set({
            user: { ...currentUser, ...userData }
          });
          
          toast.success("Profile updated successfully");
        } catch (error) {
          console.error('Error updating user:', error);
          toast.error("Failed to update profile");
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

const formatPostedAt = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
};

export const signInWithLinkedIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
  });
  if (error) throw error;
};
