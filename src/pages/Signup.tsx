
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we'll just log the user in
      console.log('Signup successful', formData);
      // Redirect to dashboard in a real app
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] py-12 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-2">Create your account</h1>
              <p className="paragraph">
                Start your journey to finding your dream job
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border shadow-sm">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="loader mr-2" />
                      Creating account...
                    </>
                  ) : 'Create Account'}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
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
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
