
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job } from '@/data/jobs';

export interface Resume {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  content?: string;
  skills?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  appliedAt: Date;
  updatedAt: Date;
  company: string;
  position: string;
}

export interface Alert {
  id: string;
  keywords: string[];
  location?: string;
  createdAt: Date;
  active: boolean;
  frequency: 'daily' | 'weekly';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  savedJobs: string[];
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  resumes: Resume[];
  applications: Application[];
  alerts: Alert[];
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  saveJob: (jobId: string) => void;
  removeJob: (jobId: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

// Mock data
const mockResumes: Resume[] = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-06-10'),
    skills: ['JavaScript', 'React', 'TypeScript', 'Node.js']
  },
  {
    id: '2',
    name: 'Product Manager Resume',
    createdAt: new Date('2023-03-22'),
    updatedAt: new Date('2023-05-18'),
    skills: ['Product Strategy', 'User Research', 'Agile', 'Roadmapping']
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '3',
    status: 'interview',
    appliedAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-06-05'),
    company: 'TechCorp Inc.',
    position: 'Senior Frontend Developer'
  },
  {
    id: '2',
    jobId: '5',
    status: 'pending',
    appliedAt: new Date('2023-06-12'),
    updatedAt: new Date('2023-06-12'),
    company: 'InnovateSoft',
    position: 'UX Designer'
  },
  {
    id: '3',
    jobId: '7',
    status: 'rejected',
    appliedAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-25'),
    company: 'Global Systems',
    position: 'Product Manager'
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    keywords: ['React', 'Frontend', 'JavaScript'],
    location: 'Remote',
    createdAt: new Date('2023-04-10'),
    active: true,
    frequency: 'daily'
  },
  {
    id: '2',
    keywords: ['Product Manager', 'Product Owner'],
    location: 'San Francisco, CA',
    createdAt: new Date('2023-05-05'),
    active: true,
    frequency: 'weekly'
  }
];

// Create store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoggedIn: false,
      
      login: (email, password) => {
        set({
          user: {
            id: '1',
            email,
            firstName: 'John',
            lastName: 'Doe',
            savedJobs: ['1', '2'],
            bio: '',
            location: '',
            website: '',
            avatarUrl: '',
            resumes: mockResumes,
            applications: mockApplications,
            alerts: mockAlerts,
            settings: {
              notifications: true,
              emailUpdates: false,
              darkMode: false,
            }
          },
          isAuthenticated: true,
          isLoggedIn: true
        });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoggedIn: false });
      },
      
      register: (email, password, firstName, lastName) => {
        set({
          user: {
            id: '1',
            email,
            firstName,
            lastName,
            savedJobs: [],
            bio: '',
            location: '',
            website: '',
            avatarUrl: '',
            resumes: [],
            applications: [],
            alerts: [],
            settings: {
              notifications: true,
              emailUpdates: false,
              darkMode: false,
            }
          },
          isAuthenticated: true,
          isLoggedIn: true
        });
      },
      
      saveJob: (jobId) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            savedJobs: [...state.user.savedJobs, jobId]
          } : null
        }));
      },
      
      removeJob: (jobId) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            savedJobs: state.user.savedJobs.filter(id => id !== jobId)
          } : null
        }));
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: 'sleekjobs-auth-storage', // name of the item in localStorage
      // Optional: Customize how the persisted state gets parsed and stored
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
