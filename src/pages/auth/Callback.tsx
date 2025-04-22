
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        toast.error('Error verifying your email', {
          description: error.message,
        });
        navigate('/login');
        return;
      }

      toast.success('Email verified successfully!', {
        description: 'You can now log in to your account.',
      });
      navigate('/dashboard');
    };

    handleEmailVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loader mb-4" />
        <h2 className="text-xl font-semibold">Verifying your email...</h2>
        <p className="text-muted-foreground">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
};

export default Callback;
