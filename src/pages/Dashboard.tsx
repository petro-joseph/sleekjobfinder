
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import JobCardCompact from '@/components/JobCardCompact';
import ParticlesBackground from '@/components/ParticlesBackground';
import { useAuthStore } from '@/lib/store';
import { jobs } from '@/data/jobs';
import { Briefcase, FileText, Bell, BookmarkIcon, ChevronRight, Award, TrendingUp, Search } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();

  // Get saved jobs from the user's saved list
  const savedJobs = jobs.filter(job => user?.savedJobs.includes(job.id));
  
  // Get random recommended jobs that aren't saved
  const recommendedJobs = jobs
    .filter(job => !user?.savedJobs.includes(job.id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  return (
    <Layout>
      <div className="relative">
        <ParticlesBackground />
        <section className="py-8 md:py-12">
          <div className="container px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, <span className="text-gradient-primary">{user?.firstName}</span>
              </h1>
              <p className="text-muted-foreground">
                Here's an overview of your job search progress
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div 
                custom={0} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
              >
                <StatCard 
                  title="Applications" 
                  value={user?.applications.length || 0} 
                  icon={<Briefcase className="h-5 w-5" />}
                  gradient 
                />
              </motion.div>
              <motion.div 
                custom={1} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
              >
                <StatCard 
                  title="Saved Jobs" 
                  value={user?.savedJobs.length || 0}
                  icon={<BookmarkIcon className="h-5 w-5" />} 
                />
              </motion.div>
              <motion.div 
                custom={2} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
              >
                <StatCard 
                  title="Resumes" 
                  value={user?.resumes.length || 0}
                  icon={<FileText className="h-5 w-5" />}
                />
              </motion.div>
              <motion.div 
                custom={3} 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
              >
                <StatCard 
                  title="Job Alerts" 
                  value={user?.alerts.filter(a => a.active).length || 0}
                  icon={<Bell className="h-5 w-5" />}
                />
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* Recommended Jobs */}
                <motion.div 
                  custom={4} 
                  initial="hidden" 
                  animate="visible" 
                  variants={fadeIn}
                  className="bg-card/70 backdrop-blur-md rounded-xl border p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Recommended Jobs</h2>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/jobs" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {recommendedJobs.map((job, index) => (
                      <JobCardCompact key={job.id} job={job} />
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button asChild>
                      <Link to="/jobs">
                        <Search className="mr-2 h-4 w-4" />
                        Find More Jobs
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                {/* Application Progress */}
                <motion.div 
                  custom={5} 
                  initial="hidden" 
                  animate="visible" 
                  variants={fadeIn}
                  className="bg-card/70 backdrop-blur-md rounded-xl border p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Application Progress</h2>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/progress" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  {user?.applications && user.applications.length > 0 ? (
                    <div className="space-y-4">
                      {user.applications.slice(0, 3).map((application) => {
                        const job = jobs.find(j => j.id === application.jobId);
                        if (!job) return null;
                        
                        return (
                          <div key={application.jobId} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded bg-secondary flex items-center justify-center text-xs font-medium">
                                {job.company.substring(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{job.title}</h4>
                                <p className="text-xs text-muted-foreground">{job.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge 
                                className={
                                  application.status === 'interview' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                  application.status === 'reviewing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                  application.status === 'offered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                  application.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                  'bg-primary/10 text-primary border-primary/20'
                                }
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-3">{application.date}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-secondary/50 rounded-lg">
                      <Briefcase className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium mb-1">No applications yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start applying to jobs to track your progress
                      </p>
                      <Button asChild>
                        <Link to="/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Saved Jobs */}
                <motion.div 
                  custom={6} 
                  initial="hidden" 
                  animate="visible" 
                  variants={fadeIn}
                  className="bg-card/70 backdrop-blur-md rounded-xl border p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <BookmarkIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Saved Jobs</h2>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/saved-jobs" className="flex items-center">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  {savedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {savedJobs.slice(0, 3).map(job => (
                        <Link 
                          key={job.id}
                          to={`/jobs/${job.id}`}
                          className="block p-3 border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors"
                        >
                          <h4 className="font-medium text-sm">{job.title}</h4>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="text-xs">
                              {job.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-2">{job.location}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-secondary/50 rounded-lg">
                      <BookmarkIcon className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        You haven't saved any jobs yet
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Resume */}
                <motion.div 
                  custom={7} 
                  initial="hidden" 
                  animate="visible" 
                  variants={fadeIn}
                  className="bg-card/70 backdrop-blur-md rounded-xl border p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Your Resumes</h2>
                  </div>
                  
                  {user?.resumes && user.resumes.length > 0 ? (
                    <div className="space-y-3">
                      {user.resumes.map(resume => (
                        <div key={resume.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{resume.name}</h4>
                            <p className="text-xs text-muted-foreground">Updated: {resume.lastUpdated}</p>
                          </div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      ))}
                      
                      <Button asChild className="w-full mt-2">
                        <Link to="/resume-builder">Update Resume</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-secondary/50 rounded-lg">
                      <FileText className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        You haven't created any resumes yet
                      </p>
                      <Button asChild size="sm">
                        <Link to="/resume-builder">Create Resume</Link>
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Premium Upsell */}
                <motion.div 
                  custom={8} 
                  initial="hidden" 
                  animate="visible" 
                  variants={fadeIn}
                  className="rounded-xl border overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Get 5x more profile views and unlock advanced features
                    </p>
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/pricing">See Plans</Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
