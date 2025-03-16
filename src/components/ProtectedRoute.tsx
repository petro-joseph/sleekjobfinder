
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access this page", {
        description: "You've been redirected to the login page"
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
