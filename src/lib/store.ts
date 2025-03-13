
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserResume = {
  id: string;
  name: string;
  lastUpdated: string;
  file?: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  resumes: UserResume[];
  savedJobs: string[];
  applications: {
    jobId: string;
    status: 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected';
    date: string;
  }[];
  alerts: {
    id: string;
    query: string;
    frequency: 'daily' | 'weekly';
    active: boolean;
  }[];
  isPremium: boolean;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveJob: (jobId: string) => void;
  removeJob: (jobId: string) => void;
  addApplication: (jobId: string) => void;
  toggleAlert: (alertId: string) => void;
  addAlert: (query: string, frequency: 'daily' | 'weekly') => void;
  addResume: (name: string, file?: string) => void;
};

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  resumes: [
    { id: '1', name: 'Software Developer Resume', lastUpdated: '2023-10-15' },
    { id: '2', name: 'Product Manager Resume', lastUpdated: '2023-09-22' }
  ],
  savedJobs: ['1', '2', '5'],
  applications: [
    { jobId: '3', status: 'interview', date: '2023-10-10' },
    { jobId: '4', status: 'applied', date: '2023-10-18' }
  ],
  alerts: [
    { id: '1', query: 'React Developer', frequency: 'daily', active: true },
    { id: '2', query: 'Product Manager', frequency: 'weekly', active: false }
  ],
  isPremium: false
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock login - in a real app, this would call an API
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      saveJob: (jobId: string) => {
        const { user } = get();
        if (!user) return;
        
        if (user.savedJobs.includes(jobId)) {
          set({
            user: {
              ...user,
              savedJobs: user.savedJobs.filter(id => id !== jobId)
            }
          });
        } else {
          set({
            user: {
              ...user,
              savedJobs: [...user.savedJobs, jobId]
            }
          });
        }
      },
      removeJob: (jobId: string) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            savedJobs: user.savedJobs.filter(id => id !== jobId)
          }
        });
      },
      addApplication: (jobId: string) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            applications: [
              ...user.applications,
              { jobId, status: 'applied', date: new Date().toISOString().split('T')[0] }
            ]
          }
        });
      },
      toggleAlert: (alertId: string) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            alerts: user.alerts.map(alert => 
              alert.id === alertId ? { ...alert, active: !alert.active } : alert
            )
          }
        });
      },
      addAlert: (query: string, frequency: 'daily' | 'weekly') => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            alerts: [
              ...user.alerts,
              { id: Date.now().toString(), query, frequency, active: true }
            ]
          }
        });
      },
      addResume: (name: string, file?: string) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            resumes: [
              ...user.resumes,
              { id: Date.now().toString(), name, lastUpdated: new Date().toISOString().split('T')[0], file }
            ]
          }
        });
      }
    }),
    {
      name: 'sleekjobs-auth',
    }
  )
);
