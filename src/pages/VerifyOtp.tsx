import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { ArrowRight, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  // Extract email from query params
  const query = new URLSearchParams(location.search);
  const email = query.get('email');

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user?.email_confirmed_at) {
          toast.success('Email verified successfully!');
          navigate('/dashboard');
        }
      }
    });

    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        toast.success('Email verified successfully!');
        navigate('/dashboard');
      }
    };

    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResendOTP = async () => {
    if (!email) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-otp?email=${encodeURIComponent(email)}`,
        },
      });

      if (error) {
        if (error.message.includes('429')) {
          toast.error('Please wait a moment before requesting another code');
        } else {
          throw error;
        }
      } else {
        toast.success('New verification code sent to your email!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    if (!otp) {
      setError('Please enter the verification code.');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      if (data.session) {
        console.log('OTP Verification Success:', data.session);
        
        // Manually update the auth store to ensure the user is logged in
        if (data.user) {
          // Use the login function from the auth store with empty password
          // as we're already authenticated via OTP
          await login(data.user.email || '', '');
        }
        
        toast.success('Email verified successfully!');
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        console.log('OTP Verification Failed: No session returned');
        setError('Invalid verification code. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] py-12 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <h1 className="heading-lg mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">
                Verify Your Email
              </h1>
              <p className="paragraph">
                We've sent a verification code to<br />
                <span className="font-medium text-foreground">{email || 'your email'}</span>
              </p>
            </div>

            <Card className="overflow-hidden glass hover backdrop-blur-xl">
              <CardContent className="p-8">
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-base">
                      Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="py-6 transition-all border-muted/30 focus:border-primary text-center text-lg tracking-wider"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:underline font-medium transition-all"
                    >
                      Send again
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyOtp;
