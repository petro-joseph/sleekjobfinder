import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  BookmarkCheck,
  Bell,
  BarChart,
  Rocket,
  Clock,
  MapPin,
  Building,
  Bot,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchJobs } from '@/api/jobs';
import { fetchApplications } from '@/api/applications';
import { fetchJobAlerts } from '@/api/jobAlerts';
import { JobCardSkeleton, TableSkeleton } from '@/components/jobs/LoadingState';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Application, RecentActivity, JobAlert } from '@/types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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
  const { user, isAuthenticated, saveJob, removeJob } = useAuthStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('[Dashboard Effect] User unauthenticated, redirecting to /login...');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch applications
  const {
    data: applications = [],
    isLoading: isLoadingApplications,
    isError: isApplicationsError,
    error: applicationsError,
  }: UseQueryResult<Application[], Error> = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: () => fetchApplications(user!.id),
    enabled: !!user?.id,
  });

  // Compute active applications count (excluding archived, matching Progress)
  const activeApplicationsCount = applications.filter((app) => app.status !== 'archived').length;

  // Fetch job alerts
  const {
    data: jobAlerts = [],
    isLoading: isLoadingJobAlerts,
    isError: isJobAlertsError,
    error: jobAlertsError,
  }: UseQueryResult<JobAlert[], Error> = useQuery({
    queryKey: ['job_alerts', user?.id],
    queryFn: () => fetchJobAlerts(user!.id),
    enabled: !!user?.id,
  });

  // Handle errors
  useEffect(() => {
    if (isApplicationsError && applicationsError) {
      toast.error(`Failed to load recent activities: ${applicationsError.message}`);
    }
    if (isJobAlertsError && jobAlertsError) {
      toast.error(`Failed to load job alerts: ${jobAlertsError.message}`);
    }
  }, [isApplicationsError, applicationsError, isJobAlertsError, jobAlertsError]);

  // Map applications to recentActivities
  const recentActivities: RecentActivity[] = applications.slice(0, 3).map((app: Application) => ({
    id: app.id,
    position: app.position,
    company: app.company,
    date: app.applied_at
      ? format(new Date(app.applied_at), 'yyyy-MM-dd')
      : format(new Date(app.updated_at), 'yyyy-MM-dd'),
    status: app.status.charAt(0).toUpperCase() + app.status.replace('_', ' ').slice(1), // e.g., "offer_received" -> "Offer Received"
  }));

  // Fetch jobs
  const { data: allJobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ['dashboardJobs'],
    queryFn: async () => {
      const response = await fetchJobs({
        jobTypes: [],
        experienceLevels: [],
        salaryRange: [50, 150],
        searchTerm: '',
        industry: '',
        location: '',
        sortBy: 'newest',
        datePosted: '',
      });
      return response.jobs;
    },
  });

  // Pagination for jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(allJobs.length / jobsPerPage);

  const isOnboardingComplete = user?.isOnboardingComplete || false;

  const handleBookmarkToggle = async (jobId: string) => {
    if (!user) {
      toast.error('You must be logged in to save jobs.');
      return;
    }
    const jobToToggle = allJobs.find((job) => job.id === jobId);
    if (!jobToToggle) return;
    try {
      if (user.savedJobs.some((j) => j.id === jobId)) {
        await removeJob(jobId);
        toast.info('Job removed from saved jobs');
      } else {
        await saveJob(jobToToggle);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      toast.error('Failed to update saved job');
    }
  };

  // Guard against unauthenticated state
  if (!isAuthenticated || !user) {
    console.log('[Dashboard Render] Not authenticated or no user, returning null.');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-white dark:bg-background">
        <div className="container mx-auto px-4 py-6 md:py-6">
          <motion.div className="grid gap-6 md:grid-cols-12" variants={containerVariants} initial="hidden" animate="show">
            <motion.div className="md:col-span-8" variants={itemVariants}>
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
                        onClick={() => navigate('/jobs')}
                      >
                        Find Jobs <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    ) : (
                      <Button
                        className="group w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                        onClick={() => navigate('/preferences')}
                      >
                        Complete your profile{' '}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={containerVariants}>
                <MobileStatCard
                  icon={<Briefcase className="h-5 w-5 text-blue-500" />}
                  value={isLoadingApplications ? 0 : activeApplicationsCount}
                  label="Applications"
                  onClick={() => navigate('/progress')}
                />
                <MobileStatCard
                  icon={<BookmarkCheck className="h-5 w-5 text-green-500" />}
                  value={user.savedJobs?.length || 0}
                  label="Saved Jobs"
                  onClick={() => navigate('/saved-jobs')}
                />
                <MobileStatCard
                  icon={<Bell className="h-5 w-5 text-yellow-500" />}
                  value={isLoadingJobAlerts ? 0 : jobAlerts.length}
                  label="Job Alerts"
                  onClick={() => navigate('/progress')}
                />
                <MobileStatCard
                  icon={<BarChart className="h-5 w-5 text-purple-500" />}
                  value={user.resumes?.length || 0}
                  label="Resumes"
                  onClick={() => navigate('/resume-builder')}
                />
              </motion.div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recommended for you</h2>
                <Button variant="link" className="text-primary text-sm" onClick={() => navigate('/jobs')}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {isLoadingJobs ? (
                <div className="grid gap-4">
                  {[...Array(jobsPerPage)].map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <motion.div className="grid gap-4" variants={containerVariants}>
                  {currentJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 rounded-xl ${job.featured ? 'border-primary/40 bg-primary/[0.03] shadow-md' : 'border-border/60'
                          }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-4 text-primary font-semibold text-xl">
                                {job.logo ? (
                                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
                                ) : (
                                  job.company.substring(0, 2)
                                )}
                              </div>
                              <div className="pt-1">
                                <h3
                                  className="font-semibold text-lg mb-1"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Building className="h-3.5 w-3.5 mr-1" />
                                    {job.company}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {job.postedAt}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                              <BookmarkCheck
                                className={`h-5 w-5 cursor-pointer ${user?.savedJobs?.some((j) => j.id === job.id)
                                    ? 'fill-primary text-primary'
                                    : 'text-muted-foreground'
                                  }`}
                                onClick={() => handleBookmarkToggle(job.id)}
                              />
                              <Badge variant="outline" className="mt-2">
                                {job.type}
                              </Badge>
                              {job.featured && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/10 mt-1">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button onClick={() => navigate(`/jobs/${job.id}`)} variant="outline" className="mr-2">
                              View Details
                            </Button>
                            <Button onClick={() => navigate(`/apply/${job.id}`)}>Apply Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </motion.div>

            <motion.div className="md:col-span-4" variants={itemVariants}>
              <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent mb-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Bot className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-bold">Career Assistant</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get personalized career advice, interview preparation, and salary negotiation tips from our AI assistant.
                  </p>
                  <Button
                    onClick={() => navigate('/career-assistant')}
                    variant="outline"
                    className="w-full touch-button"
                  >
                    Chat with Career Assistant
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-primary/20 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent mb-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-5 w-5 text-primary mr-2 animate-pulse" />
                    <h3 className="font-bold">Upgrade to Premium</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get 5x more job matches, priority application status, and direct contact with recruiters.
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Rocket className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Priority application status</span>
                    </div>
                    <div className="flex items-center">
                      <Rocket className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">AI-powered resume optimization</span>
                    </div>
                    <div className="flex items-center">
                      <Rocket className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Direct message recruiters</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/pricing')}
                    variant="gradient"
                    className="w-full touch-button bg-primary text-primary-foreground"
                  >
                    View Plans
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl border-primary/20 shadow-lg mt-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingApplications ? (
                    <TableSkeleton />
                  ) : isApplicationsError ? (
                    <p className="text-sm text-red-500">Error loading activities</p>
                  ) : recentActivities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activities</p>
                  ) : (
                    <>
                      {recentActivities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          role="listitem"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                          <div className="ml-3">
                            <div className="font-medium">{activity.position}</div>
                            <div className="text-sm text-muted-foreground">{activity.company}</div>
                            <div className="text-xs text-muted-foreground/70 mt-1">
                              {format(new Date(activity.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${activity.status.toLowerCase() === 'interview'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : activity.status.toLowerCase() === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : activity.status.toLowerCase() === 'offer received'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      : activity.status.toLowerCase() === 'archived'
                                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}
                            >
                              {activity.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      <Button
                        onClick={() => navigate('/progress')}
                        variant="ghost"
                        className="w-full text-primary justify-center mt-2 touch-button"
                      >
                        View all activity
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

const MobileStatCard = ({
  icon,
  value,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        className="backdrop-blur-xl border-primary/20 border-2 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group hover:border-primary/40 rounded-xl"


        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <CardContent className="p-4 flex items-center">
          <div className="mr-3 p-2 rounded-full bg-background/50 transition-all group-hover:scale-110">{icon}</div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;