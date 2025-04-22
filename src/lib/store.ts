import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job } from '@/data/jobs';
import { Resume as BaseResume } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';

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

export interface Application {
  id: string;
  jobId?: string;
  position: string;
  company: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'reviewed' | 'accepted';
  createdAt: string;
  updatedAt: string;
  appliedAt?: string;
}

export interface Alert {
  id: string;
  query: string;
  keywords: string[];
  location?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export interface Resume extends Pick<BaseResume, 
  "id" | 
  "name" | 
  "file_path" | 
  "isPrimary" | 
  "created_at" | 
  "updated_at" | 
  "uploadDate"
> {}

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
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

const defaultUser: User = {
  id: randomUUID(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  applications: [],
  savedJobs: [],
  alerts: [],
  resumes: [],
  onboardingStep: 2,
  isOnboardingComplete: false,
  jobPreferences: {
    locations: ['Remote', 'New York, NY'],
    jobTypes: ['Full-time', 'Remote'],
    industries: ['Technology'],
    salaryRange: {
      min: 50000,
      max: 120000
    }
  },
  settings: {
    notifications: true,
    emailUpdates: false,
    darkMode: false,
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          set({ 
            isAuthenticated: true, 
            user: {
              id: user.id,
              email: user.email!,
              firstName: profile?.first_name || '',
              lastName: profile?.last_name || '',
              avatarUrl: profile?.avatar_url,
              applications: [],
              savedJobs: [],
              alerts: [],
              resumes: [],
              settings: {
                notifications: true,
                emailUpdates: false,
                darkMode: false,
              }
            }
          });
        }
      },
      logout: async () => {
        try {
          set({ isAuthenticated: false, user: null });
          await supabase.auth.signOut();
        } catch (error) {
          console.error("Error during logout:", error);
        }
      },
      register: async (userData) => {
        const { data: { user }, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.firstName,
              last_name: userData.lastName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

        if (user) {
          toast.success(
            "Please check your email to verify your account.",
            {
              description: "We've sent you a verification link.",
              duration: 5000,
            }
          );
        }
      },
      saveJob: (job) => {
        set((state) => {
          if (!state.user) return state;
          
          const isJobSaved = state.user.savedJobs.some(j => j.id === job.id);
          if (isJobSaved) return state;
          
          return {
            ...state,
            user: {
              ...state.user,
              savedJobs: [...state.user.savedJobs, job]
            }
          };
        });
      },
      removeJob: (jobId) => {
        set((state) => {
          if (!state.user) return state;
          
          return {
            ...state,
            user: {
              ...state.user,
              savedJobs: state.user.savedJobs.filter(job => job.id !== jobId)
            }
          };
        });
      },
      updateUser: (userData) => {
        set((state) => {
          if (!state.user) return state;
          
          return {
            ...state,
            user: {
              ...state.user,
              ...userData
            }
          };
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
