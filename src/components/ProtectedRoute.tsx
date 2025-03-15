
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoggedIn } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated && !isLoggedIn) {
      toast.error("Please log in to access this page", {
        description: "You've been redirected to the login page"
      });
    }
  }, [isAuthenticated, isLoggedIn]);

  // Check both authentication states for better reliability
  if (!isAuthenticated && !isLoggedIn) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("User is authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
