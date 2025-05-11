
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { LoadingSpinner } from './jobs/LoadingState';

export default function ProtectedRoute() {
  const { isAuthenticated, fetchUserProfile } = useAuthStore()
  const location = useLocation()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check auth status on component mount
    const checkAuth = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      toast.error("Please log in to access this page", {
        description: "You've been redirected to the login page"
      });
    }
  }, [isAuthenticated, isCheckingAuth]);

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not logged in, redirect to login, preserving the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Once authenticated, render the child routes (via <Outlet />)
  return <Outlet />
}
