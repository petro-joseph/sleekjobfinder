
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from "sonner";
import { useAuthStore } from '@/lib/store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

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
    
    // Simulate API call for mock login
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if credentials match our mock user
      if (email === 'johndoe@example.com' && password === 'qwerty@2025') {
        // Success - set authenticated in global store
        login(email, password);
        
        // Show success toast
        toast.success("Login successful! Welcome back.", {
          position: "top-center",
          duration: 3000,
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Failed login
        setError('Invalid email or password');
      }
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] py-12 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">Welcome back</h1>
              <p className="paragraph">
                Log in to continue your job search journey
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
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline transition-all">
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
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me for 30 days
                    </Label>
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="loader mr-2" />
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
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button variant="glass" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 186.69 190.5" className="mr-2">
                    <g>
                      <path d="M95.25 42.75v36.19h51.02c-2.37 13.31-9.52 24.56-20.27 32.11l32.65 25.39c19.05-17.55 30.05-43.39 30.05-74.19 0-7.1-0.61-13.96-1.73-20.59H95.25z" fill="#4285F4"/>
                      <path d="M42.75 76.44c-3.78-9.27-5.91-19.3-5.91-29.94s2.13-20.67 5.91-29.94V0H5.96C2.15 15.32 0 31.63 0 47.5c0 15.87 2.15 32.18 5.96 47.5h36.79V76.44z" fill="#34A853"/>
                      <path d="M95.25 190.5c26.47 0 48.59-8.75 64.8-23.81l-32.65-25.39c-9.09 6.14-20.67 9.52-32.15 9.52-24.69 0-45.66-16.58-53.13-38.88h-36.5v26.25c15.35 29.59 46.06 52.31 89.64 52.31z" fill="#EA4335"/>
                      <path d="M42.12 113.17c-1.89-5.66-2.98-11.7-2.98-18.33 0-6.63 1.09-12.67 2.98-18.33V50.26H5.96C2.15 65.58 0 81.89 0 97.76c0 15.87 2.15 32.18 5.96 47.5l36.16-32.09z" fill="#FBBC04"/>
                    </g>
                  </svg>
                  Continue with Google
                </Button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium transition-all">
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <div className="text-muted-foreground text-xs">
                <p>Demo credentials:</p>
                <p>Email: johndoe@example.com | Password: qwerty@2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
