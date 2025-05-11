
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/custom.css'
import './styles/mobile.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { useAuthStore } from './lib/store.ts'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

// AuthInitializer component to handle session checks on app load
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { fetchUserProfile } = useAuthStore();

  useEffect(() => {
    // Check for existing session on app load
    fetchUserProfile().catch(err => {
      console.error("Failed to restore auth session:", err);
    });
  }, [fetchUserProfile]);

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
