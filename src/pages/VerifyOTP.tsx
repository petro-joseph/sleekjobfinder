
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here we would normally verify the OTP with an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP verified successfully');
      navigate('/reset-password');
    } catch (error) {
      toast.error('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>
          <p className="text-center text-muted-foreground mb-6">
            Please enter the one-time password sent to your email.
          </p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input 
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p>
              Didn't receive an OTP?{' '}
              <button 
                className="text-primary hover:underline"
                onClick={() => toast.info('OTP resent to your email')}
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyOTP;
