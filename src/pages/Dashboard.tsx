
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, BookmarkCheck, Bell, BarChart, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import JobCardCompact from '@/components/JobCardCompact';
import { toast } from "sonner";
import { jobs } from '@/data/jobs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [profileBarVisible, setProfileBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if welcome card has been shown for this session
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
      // Set flag after showing welcome card
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  // Reset welcome card flag on logout
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('hasSeenWelcome');
    }
  }, [isAuthenticated]);

  // Handle profile bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setProfileBarVisible(false);
      } else {
        setProfileBarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Navigate to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      toast.error("Please log in to access the dashboard", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, user]);

  // Prevent blank display by early return with null only if redirecting
  if (!user && !isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  // Default empty data for safety to prevent blank screen if user object is incomplete
  const userData = user || { 
    firstName: 'User', 
    lastName: '', 
    email: '', 
    bio: '',
    applications: [],
    savedJobs: [],
    alerts: [],
    resumes: []
  };

  // Only show 2 jobs on mobile for less clutter
  const recommendedJobs = [
    jobs[0], // First job from our jobs array
    jobs[3]  // Fourth job from our jobs array
  ];
  const displayedJobs = recommendedJobs.slice(0, 2);

  return (
    <Layout>
      {/* Mobile Profile Summary - LinkedIn Style Sticky Bar */}
      <div 
        className={`md:hidden fixed top-[76px] left-0 right-0 z-40 glassmorphism transition-transform duration-300 ${
          profileBarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary/70 text-white">
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium">{userData.firstName} {userData.lastName}</div>
              <div className="text-xs text-muted-foreground">{userData.bio || 'Complete your profile'}</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full p-2 h-8 w-8"
            onClick={() => navigate('/profile')}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-[calc(100vh-160px)] bg-gradient-mesh">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
          {/* Mobile Grid Layout for Dashboard */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Main Content - Full Width on Mobile */}
            <div className="md:col-span-8">
              {/* Welcome Card - Moved to top, conditionally shown */}
              {showWelcome && (
                <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg mb-6 text-center">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 items-center">
                      <div>
                        <h2 className="text-xl font-bold mb-2">Welcome back, {userData.firstName}</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                          Here's what's happening with your job search today
                        </p>
                      </div>
                      <Button 
                        className="group w-full md:w-auto touch-button" 
                        variant="gradient"
                        onClick={() => navigate('/jobs')}
                      >
                        Find Jobs
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Stats Cards - 2x2 on mobile, 4-column on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <MobileStatCard 
                  icon={<Briefcase className="h-5 w-5 text-blue-500" />}
                  value={userData.applications.length}
                  label="Applications"
                  onClick={() => navigate('/progress')}
                />
                <MobileStatCard 
                  icon={<BookmarkCheck className="h-5 w-5 text-green-500" />}
                  value={userData.savedJobs.length}
                  label="Saved Jobs"
                  onClick={() => navigate('/saved-jobs')}
                />
                <MobileStatCard 
                  icon={<Bell className="h-5 w-5 text-yellow-500" />}
                  value={userData.alerts.length}
                  label="Job Alerts"
                  onClick={() => navigate('/progress')}
                />
                <MobileStatCard 
                  icon={<BarChart className="h-5 w-5 text-purple-500" />}
                  value={userData.resumes.length}
                  label="Resumes"
                  onClick={() => navigate('/resume-builder')}
                />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recommended for you</h2>
                <Button variant="link" className="text-primary text-sm" onClick={() => navigate('/jobs')}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4">
                {displayedJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <JobCardCompact job={job} />
                  </div>
                ))}
                
                {recommendedJobs.length > 2 && (
                  <Button 
                    variant="outline" 
                    className="w-full touch-button mt-2"
                    onClick={() => navigate('/jobs')}
                  >
                    Load More Jobs
                  </Button>
                )}
              </div>
            </div>
            
            {/* Right Sidebar - Full Width on Mobile */}
            <div className="md:col-span-4">
              {/* Profile Summary - Hidden on mobile, visible on desktop */}
              <Card className="hidden md:block glass hover backdrop-blur-xl border-primary/20 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-center">Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/90 to-primary/70 flex items-center justify-center text-white font-bold">
                        {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{userData.firstName} {userData.lastName}</div>
                        <div className="text-sm text-muted-foreground">{userData.email}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={() => navigate('/profile')} 
                        variant="outline" 
                        className="w-full justify-between touch-button"
                      >
                        Complete your profile
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-6 space-y-4">
                  {userData.applications.slice(0, 3).map(app => (
                    <div key={app.id} className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                      <div className="ml-3">
                        <div className="font-bold">{app.position}</div>
                        <div className="text-sm text-muted-foreground">{app.company}</div>
                        <div className="text-[10px] text-muted-foreground/70 mt-1">
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'interview' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => navigate('/progress')} 
                    variant="ghost" 
                    className="w-full text-primary justify-center mt-2 touch-button"
                  >
                    View all activity
                  </Button>
                </CardContent>
              </Card>
              
              {/* Premium Upgrade - Mobile Optimized */}
              <Card className="mt-6 overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-3 md:p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-bold">Upgrade to Premium</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get 5x more job matches and priority application status
                  </p>
                  <Button 
                    onClick={() => navigate('/pricing')} 
                    variant="gradient" 
                    className="w-full touch-button"
                  >
                    View Plans
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Mobile Optimized Stat Card Component
const MobileStatCard = ({ 
  icon, 
  value, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode; 
  value: number; 
  label: string; 
  onClick: () => void;
}) => {
  return (
    <Card 
      className="glass hover backdrop-blur-xl border-primary/20 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center">
        <div className="mr-3 p-2 rounded-full bg-background/50 transition-all group-hover:scale-110">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
