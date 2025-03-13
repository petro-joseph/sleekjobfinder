import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { jobs } from '@/data/jobs';
import { useAuthStore } from '@/lib/store';
import { BookmarkIcon, Briefcase, MapPin, Clock, Search, X, Filter, ArrowUpDown } from 'lucide-react';

const SavedJobs = () => {
  const { user, removeJob } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'relevant'>('newest');
  const [industryFilter, setIndustryFilter] = useState<string>('');

  const savedJobs = jobs.filter(job => user?.savedJobs.includes(job.id));
  const industries = Array.from(new Set(savedJobs.map(job => job.industry)));

  const filteredJobs = savedJobs
    .filter(job => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower);
      
      const matchesIndustry = !industryFilter || job.industry === industryFilter;
      
      return matchesSearch && matchesIndustry;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const getPostedDays = (postedAt: string) => {
          const match = postedAt.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getPostedDays(a.postedAt) - getPostedDays(b.postedAt);
      } else {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

  const handleRemoveJob = (jobId: string) => {
    removeJob(jobId);
    toast.success("Job removed from saved jobs");
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setIndustryFilter('');
    setSortBy('newest');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Jobs</h1>
            <p className="text-muted-foreground">
              View and manage all the jobs you've saved for later
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-primary" />
                  Filters
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <Select
                      value={industryFilter}
                      onValueChange={setIndustryFilter}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Industries</SelectItem>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as 'newest' | 'relevant')}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="relevant">Relevant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/jobs">
                      <Search className="h-4 w-4 mr-2" />
                      Find More Jobs
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/resume-builder">
                      <FileText className="h-4 w-4 mr-2" />
                      Update Resume
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/progress">
                      <Clock className="h-4 w-4 mr-2" />
                      Track Applications
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-3"
            >
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search saved jobs by title or company..."
                  className="pl-10 bg-background"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} saved {filteredJobs.length === 1 ? 'job' : 'jobs'}
                  {(searchTerm || industryFilter) && ' matching your filters'}
                </p>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {sortBy === 'newest' ? 'Newest first' : 'Most relevant'}
                  </span>
                </div>
              </div>

              {filteredJobs.length > 0 ? (
                <motion.div
                  variants={staggerItems}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredJobs.map(job => (
                    <SavedJobCard
                      key={job.id}
                      job={job}
                      onRemove={() => handleRemoveJob(job.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="bg-card rounded-xl border shadow-sm p-10 text-center">
                  <BookmarkX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved jobs found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {savedJobs.length > 0
                      ? "No jobs match your current filters. Try adjusting your search criteria."
                      : "You haven't saved any jobs yet. Browse jobs and click the bookmark icon to save them for later."}
                  </p>
                  <Button asChild>
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const SavedJobCard = ({ job, onRemove }: { job: Job; onRemove: () => void }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
              {job.logo ? (
                <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
              ) : (
                job.company.substring(0, 2)
              )}
            </div>
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {job.location}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {job.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {job.industry}
                </Badge>
                {job.featured && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/10 text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {job.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{job.postedAt}</span>
          </div>
          <div className="space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/jobs/${job.id}`}>View Details</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={`/apply/${job.id}`}>Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SavedJobs;
