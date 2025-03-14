import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase, BookmarkCheck, Bell, BarChart } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import JobCardCompact from '@/components/JobCardCompact';
import { toast } from "sonner";
import { jobs } from '@/data/jobs';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access the dashboard", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Recommended jobs - use actual job data from our jobs array
  const recommendedJobs = [
    jobs[0], // First job from our jobs array
    jobs[3]  // Fourth job from our jobs array
  ];

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-gradient-mesh">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-12">
          {/* Welcome Card */}
          <Card className="overflow-hidden glass hover backdrop-blur-xl border-primary/20 shadow-lg animate-fade-in mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">
                    Welcome back, {user.firstName}
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Here's what's happening with your job search today
                  </p>
                </div>
                <Button className="group w-full md:w-auto" onClick={() => navigate('/jobs')}>
                  Find Jobs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Cards - Horizontal Scrollable on Mobile */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <MobileStatCard 
              icon={<Briefcase className="h-5 w-5 text-blue-500" />}
              value={user.applications.length}
              label="Applications"
              onClick={() => navigate('/progress')}
            />
            <MobileStatCard 
              icon={<BookmarkCheck className="h-5 w-5 text-green-500" />}
              value={user.savedJobs.length}
              label="Saved Jobs"
              onClick={() => navigate('/saved-jobs')}
            />
            <MobileStatCard 
              icon={<Bell className="h-5 w-5 text-yellow-500" />}
              value={user.alerts.length}
              label="Job Alerts"
              onClick={() => navigate('/progress')}
            />
            <MobileStatCard 
              icon={<BarChart className="h-5 w-5 text-purple-500" />}
              value={user.resumes.length}
              label="Resumes"
              onClick={() => navigate('/resume-builder')}
            />
          </div>
          
          {/* Mobile Grid Layout for Dashboard */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Recommended Jobs - Full Width on Mobile */}
            <div className="md:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recommended for you</h2>
                <Button variant="link" className="text-primary text-sm" onClick={() => navigate('/jobs')}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4">
                {recommendedJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <JobCardCompact job={job} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Sidebar - Full Width on Mobile */}
            <div className="md:col-span-4">
              {/* Profile Summary */}
              <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
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
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.applications.slice(0, 3).map(app => (
                    <div key={app.id} className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                      <div className="ml-3">
                        <div className="font-medium">{app.position}</div>
                        <div className="text-sm text-muted-foreground">{app.company}</div>
                        <div className="text-xs text-muted-foreground/70 mt-1">
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
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
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