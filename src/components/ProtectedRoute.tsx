
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoggedIn } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated && !isLoggedIn && !user) {
      toast.error("Please log in to access this page", {
        description: "You've been redirected to the login page"
      });
    }
  }, [isAuthenticated, isLoggedIn, user]);

  // If not authenticated, redirect to login
  if (!isAuthenticated && !isLoggedIn && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
