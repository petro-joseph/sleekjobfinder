
import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/api/jobs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { JobCardSkeleton } from '@/components/jobs/LoadingState';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ArrowRight,
  BookmarkCheck,
  Clock,
  MapPin,
  Building,
} from 'lucide-react';

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

interface RecommendedJobsProps {
  onNavigate: (path: string) => void;
}

const RecommendedJobs = ({ onNavigate }: RecommendedJobsProps) => {
  const { user, saveJob, removeJob } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  // Fetch recommended jobs with proper lazy loading
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
    staleTime: 2 * 60 * 1000, // 2 minutes caching
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  // Pagination calculation with memoization
  const { currentJobs, totalPages } = useMemo(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    return {
      currentJobs: allJobs.slice(indexOfFirstJob, indexOfLastJob),
      totalPages: Math.ceil(allJobs.length / jobsPerPage)
    };
  }, [allJobs, currentPage, jobsPerPage]);

  // Memoized bookmark toggle handler to prevent unnecessary re-renders
  const handleBookmarkToggle = useCallback(async (jobId: string) => {
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
  }, [user, allJobs, saveJob, removeJob]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recommended for you</h2>
        <Button variant="link" className="text-primary text-sm" onClick={() => onNavigate('/jobs')}>
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
                          onClick={() => onNavigate(`/jobs/${job.id}`)}
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
                    <Button onClick={() => onNavigate(`/jobs/${job.id}`)} variant="outline" className="mr-2">
                      View Details
                    </Button>
                    <Button onClick={() => onNavigate(`/apply/${job.id}`)}>Apply Now</Button>
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
    </>
  );
};

export default RecommendedJobs;
