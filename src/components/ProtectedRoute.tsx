
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { Skeleton } from '@/components/ui/skeleton';

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
        // Use requestAnimationFrame to ensure UI updates after other renders
        requestAnimationFrame(() => {
          setIsCheckingAuth(false);
        });
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
      <div className="min-h-screen container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <Skeleton className="h-32 w-full mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
          <div className="md:col-span-4 space-y-6 mt-6 md:mt-0">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
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
