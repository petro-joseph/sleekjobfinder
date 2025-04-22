import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job } from '@/data/jobs';
import { Resume as BaseResume } from '@/types/resume';

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

export interface Resume extends Pick<BaseResume, "id" | "name" | "created_at" | "updated_at" | "file_path" | "isPrimary" | "uploadDate"> {}

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
  logout: () => void;
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
        set({ isAuthenticated: true, user: defaultUser });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      register: async (userData) => {
        const newUser: User = {
          id: Math.random().toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          applications: [],
          savedJobs: [],
          alerts: [],
          resumes: [],
          onboardingStep: 1,
          isOnboardingComplete: false,
          settings: {
            notifications: true,
            emailUpdates: false,
            darkMode: false,
          }
        };
        set({ isAuthenticated: true, user: newUser });
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
