import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { ArrowRight, AlertCircle } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query params
  const query = new URLSearchParams(location.search);
  const email = query.get('email');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      // Verify OTP using Supabase's verifyOtp method
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        setError(error.message || 'Failed to verify OTP. Please try again.');
        return;
      }

      if (data.session) {
        // OTP verified successfully, user is signed in
        // Update profiles table
        // const { error: updateError } = await supabase
        //   .from('profiles')
        //   .update({ is_email_verified: true })
        //   .eq('email', email);

        // if (updateError) {
        //   console.error('Error updating profile:', updateError);
        //   setError('Failed to update profile. Please try again.');
        //   return;
        // }

        toast.success('Email verified successfully!', {
          position: 'top-center',
          duration: 3000,
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] py-12 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">
                Verify Your Email
              </h1>
              <p className="paragraph">
                Enter the OTP sent to {email || 'your email'}
              </p>
            </div>

            <Card className="overflow-hidden glass hover backdrop-blur-xl">
              <CardContent className="p-8">
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-base">
                      OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="py-6 transition-all border-muted/30 focus:border-primary"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Verify OTP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyOtp;