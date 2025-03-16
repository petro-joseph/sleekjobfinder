
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job } from '@/data/jobs';

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

export interface Resume {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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
  logout: () => void;
  register: (userData: UserRegistration) => Promise<void>;
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

const defaultUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  applications: [],
  savedJobs: [],
  alerts: [],
  resumes: [],
  settings: {
    notifications: false,
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
        // Here you would typically make an API call to authenticate the user
        // For this example, we'll just simulate a successful login
        set({ isAuthenticated: true, user: defaultUser });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      register: async (userData) => {
        // Here you would typically make an API call to register the user
        // For this example, we'll just simulate a successful registration
        const newUser: User = {
          id: Math.random().toString(), // Generate a random ID
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          applications: [],
          savedJobs: [],
          alerts: [],
          resumes: [],
          settings: {
            notifications: false,
            emailUpdates: false,
            darkMode: false,
          }
        };
        set({ isAuthenticated: true, user: newUser });
      },
      saveJob: (job) => {
        set((state) => {
          if (!state.user) return state;
          
          // Check if job is already saved
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
