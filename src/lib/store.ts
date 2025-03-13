import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  savedJobs: string[];
  bio?: string;
  location?: string;
  website?: string;
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
    darkMode: boolean;
  };
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  saveJob: (jobId: string) => void;
  removeJob: (jobId: string) => void;
  updateUser: (userData: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
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
        settings: {
          notifications: true,
          emailUpdates: false,
          darkMode: false,
        }
      },
      isLoggedIn: true
    });
  },
  
  logout: () => {
    set({ user: null, isLoggedIn: false });
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
        settings: {
          notifications: true,
          emailUpdates: false,
          darkMode: false,
        }
      },
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
    set({ user: userData });
  }
}));
