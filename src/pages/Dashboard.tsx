
import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { preloadRouteGroup } from '@/utils/preloadRoutes';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { ProgressiveLoad, InitialMount } from '@/components/dashboard/ProgressiveLoad';

// Import modularized components
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecommendedJobs from '@/components/dashboard/RecommendedJobs';
import RecentActivity from '@/components/dashboard/RecentActivity';
import CareerAssistantWidget from '@/components/dashboard/CareerAssistantWidget';
import PremiumWidget from '@/components/dashboard/PremiumWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('[Dashboard Effect] User unauthenticated, redirecting to /login...');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Preload related routes when dashboard is loaded
  useEffect(() => {
    if (isAuthenticated) {
      // Preload job-related routes when the user visits the dashboard
      preloadRouteGroup('jobs');
    }
  }, [isAuthenticated]);

  // Memoized navigation handler
  const handleNavigate = useCallback((path: string) => {
    // Preload destination route content
    if (path.startsWith('/jobs/')) {
      preloadRouteGroup('jobs');
    }
    navigate(path);
  }, [navigate]);

  // Guard against unauthenticated state
  if (!isAuthenticated || !user) {
    console.log('[Dashboard Render] Not authenticated or no user, returning null.');
    return null;
  }

  const isOnboardingComplete = user?.isOnboardingComplete || false;

  // Use InitialMount to prevent layout shifts during initial load
  return (
    <Layout>
      <InitialMount>
        <ProgressiveLoad 
          isLoading={false} // Always show content immediately since we show skeletons for individual sections
          skeleton={<DashboardSkeleton />}
          delay={0}
        >
          <div className="min-h-[calc(100vh-160px)] bg-white dark:bg-background">
            <div className="container mx-auto px-4 py-6 md:py-6">
              <motion.div className="grid gap-6 md:grid-cols-12" variants={containerVariants} initial="hidden" animate="show">
                <motion.div className="md:col-span-8" variants={itemVariants}>
                  {/* Welcome card - static content */}
                  <Card className="backdrop-blur-xl border-2 border-primary/20 shadow-lg mb-6 overflow-hidden rounded-xl hover:border-primary/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">Welcome back, {user?.firstName || 'User'}</h2>
                          <p className="text-base text-muted-foreground opacity-90">
                            Here's what's happening with your job search today
                          </p>
                        </div>
                        {isOnboardingComplete ? (
                          <Button
                            className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                            onClick={() => handleNavigate('/jobs')}
                          >
                            Find Jobs <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        ) : (
                          <Button
                            className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                            onClick={() => handleNavigate('/preferences')}
                          >
                            Complete your profile{' '}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats cards - lazily fetch counts only */}
                  <DashboardStats onNavigate={handleNavigate} />

                  {/* Recommended jobs section - lazy loaded */}
                  <RecommendedJobs onNavigate={handleNavigate} />
                </motion.div>

                <motion.div className="md:col-span-4" variants={itemVariants}>
                  {/* Static widgets */}
                  <CareerAssistantWidget onNavigate={handleNavigate} />
                  <PremiumWidget onNavigate={handleNavigate} />
                  
                  {/* Recent activity - lazy loaded */}
                  <RecentActivity onNavigate={handleNavigate} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </ProgressiveLoad>
      </InitialMount>
    </Layout>
  );
};

export default Dashboard;
