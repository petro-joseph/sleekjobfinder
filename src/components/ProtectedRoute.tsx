
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/store'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access this page", {
        description: "You've been redirected to the login page"
      });
    }
  }, [isAuthenticated]);

  // If not logged in, redirect to login, preserving the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Once authenticated, render the child routes (via <Outlet />)
  return <Outlet />
}
