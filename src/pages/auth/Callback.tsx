
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';

const Callback = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the hash fragment or query string from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast.error('Error verifying your authentication', {
            description: error.message,
          });
          navigate('/login');
          return;
        }

        // If we have a session, we're authenticated
        if (data.session) {
          toast.success('Authentication successful!', {
            description: 'You are now logged in to your account.',
          });
          navigate('/dashboard');
          return;
        }
        
        // If we're here, something went wrong but we don't have an error
        toast.warning('Authentication process incomplete', {
          description: 'Please try logging in again.',
        });
        navigate('/login');
      } catch (err: any) {
        console.error('Auth callback error:', err);
        toast.error('Authentication error', {
          description: err.message || 'An unexpected error occurred during authentication.',
        });
        navigate('/login');
      }
    };

    // If user is already authenticated, just go to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    handleAuthCallback();
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="loader mb-4" />
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in process.</p>
      </div>
    </div>
  );
};

export default Callback;
