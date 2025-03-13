
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Reset instructions sent to your email');
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] py-12 flex items-center bg-gradient-mesh">
        <div className="container mx-auto px-6">
          {!isSuccess ? (
            <Card className="max-w-md mx-auto glass hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="mb-2">Reset Your Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you instructions to reset your password.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full group" 
                    disabled={isLoading}
                    variant="gradient"
                  >
                    {isLoading ? (
                      <>
                        <div className="loader mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Instructions
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-center border-t pt-6">
                <Button asChild variant="ghost" size="sm" className="group">
                  <Link to="/login" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto glass animate-fade-in">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2">Check Your Email</CardTitle>
                <CardDescription>
                  We've sent password reset instructions to {email}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center text-sm text-muted-foreground">
                <p className="mb-6">
                  If you don't see the email in your inbox, please check your spam folder or make sure the email address is correct.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/login">Return to Login</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
