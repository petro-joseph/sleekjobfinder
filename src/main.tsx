
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/custom.css'
import './styles/mobile.css'
import { HelmetProvider } from 'react-helmet-async'
import { useAuthStore } from './lib/store.ts'
import { QueryProvider } from './providers/QueryProvider'

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
      <QueryProvider>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </QueryProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
