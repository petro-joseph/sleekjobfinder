import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { useAuthStore, signInWithGoogle, signInWithLinkedIn } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: (momentListener?: any) => void;
        };
      };
    };
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  // Initialize Google One Tap
  useEffect(() => {
    // Load the Google Identity Services API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeOneTap;
      document.body.appendChild(script);
    };

    // Initialize One Tap after script is loaded
    const initializeOneTap = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: '290315115196-25pkfantef0g4kc7lpj9nlqcgr1ks0kl.apps.googleusercontent.com', // Use the same client ID as in Supabase
          callback: handleOneTapResponse,
          auto_select: true,
          cancel_on_tap_outside: false,
          prompt_parent_id: 'oneTapContainer',
          context: 'signin'
        });

        // Only show One Tap if user is not authenticated
        if (!isAuthenticated) {
          try {
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // One Tap was not displayed or was skipped - don't show any error
                console.log('One Tap not displayed or skipped:', notification.getNotDisplayedReason() || notification.getSkippedReason());
              }
            });
          } catch (err) {
            console.error('Failed to prompt One Tap:', err);
          }
        }
      }
    };

    // Handle the response from One Tap
    const handleOneTapResponse = async (response: any) => {
      try {
        setIsLoading(true);
        setError('');
        
        // Pass the credential token to Supabase
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (error) throw error;
        
        // Auth state will be handled by the Supabase listener in App.tsx
        toast.success("Signed in with Google successfully!");
        navigate('/dashboard');
      } catch (error: any) {
        console.error('One Tap sign in error:', error);
        toast.error(error.message || 'Failed to sign in with Google One Tap');
        setError(error.message || 'Failed to sign in with Google One Tap');
      } finally {
        setIsLoading(false);
      }
    };

    // Clear any existing errors when component mounts
    setError('');
    setNeedsVerification(false);
    
    // Check if user is already authenticated and redirect
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Only load Google script if not authenticated
      loadGoogleScript();
    }

    // Clean up any Google One Tap resources when component unmounts
    return () => {
      // Cancel any ongoing One Tap prompts
      if (window.google?.accounts?.id) {
        try {
          // Note: Try to cancel if method exists, but don't throw error if it doesn't
          const googleId = window.google.accounts.id;
          if (typeof googleId['cancel'] === 'function') {
            googleId['cancel']();
          }
        } catch (err) {
          console.error('Failed to cancel One Tap:', err);
        }
      }
    };
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First check if this user exists and email is confirmed
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Try to sign in
      await login(email, password);
      
      // If login was successful
      toast.success("Login successful! Welcome back.", {
        position: "top-center",
        duration: 3000,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if the error is due to unconfirmed email
      if (error.message && error.message.includes('Email not confirmed')) {
        setNeedsVerification(true);
        setVerificationEmail(email);
        toast.error('Please verify your email address to continue', {
          position: "top-center",
          duration: 5000,
        });
      } else {
        setError(error.message || 'Failed to login. Please check your credentials.');
        toast.error(error.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
      console.log('Login attempt finished');
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: verificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-otp?email=${encodeURIComponent(verificationEmail)}`,
        },
      });

      if (error) {
        if (error.message.includes('429')) {
          toast.error('Please wait a moment before requesting another verification email');
        } else {
          throw error;
        }
      } else {
        toast.success('Verification email sent! Please check your inbox', {
          position: "top-center",
          duration: 5000,
        });
        // Navigate to verification page
        navigate(`/verify-otp?email=${encodeURIComponent(verificationEmail)}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      // Auth state will be handled by Supabase's session listener
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      setError('');
      await signInWithLinkedIn();
      // Auth state will be handled by Supabase's session listener
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with LinkedIn');
      toast.error(error.message || 'Failed to sign in with LinkedIn');
    }
  };

  return (
    <Layout>
      <div id="oneTapContainer" style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}></div>
      <div className="min-h-[calc(100vh-180px)] py-12 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">
                Welcome back
              </h1>
              <p className="paragraph">
                Log in to continue your job search journey
              </p>
            </div>

            <Card className="overflow-hidden glass hover backdrop-blur-xl">
              <CardContent className="p-8">
                {error && !needsVerification && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                <div className="my-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="text-primary hover:underline font-medium transition-all"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>



                <div className="space-y-4 mt-6">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Login with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handleLinkedInSignIn}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                      />
                    </svg>
                    Login with LinkedIn
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/95"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {needsVerification ? (
                  <div className="bg-primary/5 p-4 rounded-lg mb-6">
                    <h3 className="text-sm font-medium mb-2">Email Verification Required</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your email address ({verificationEmail}) needs to be verified before you can log in.
                      Please check your inbox for the verification link or click below to resend it.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={handleResendVerification}
                        variant="secondary"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending verification...
                          </>
                        ) : (
                          'Resend Verification Email'
                        )}
                      </Button>
                      <button
                        onClick={() => {
                          setNeedsVerification(false);
                          setError('');
                        }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors w-full text-center"
                      >
                        Try different email
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 py-6 transition-all border-muted/30 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-base">Password</Label>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-primary hover:underline transition-all"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 py-6 transition-all border-muted/30 focus:border-primary"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ?
                            <EyeOff className="h-5 w-5" /> :
                            <Eye className="h-5 w-5" />
                          }
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Remember me for 30 days
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Log in
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
