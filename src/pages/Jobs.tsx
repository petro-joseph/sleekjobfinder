
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import JobCard from '@/components/JobCard';
import JobsHeader from '@/components/jobs/JobsHeader';
import { Job } from '@/data/jobs';
import { Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs, JobFilters } from "@/api/jobs";

// Update FilterValues interface to match JobFilters
interface FilterValues {
  jobTypes: Record<string, boolean>;
  experienceLevels: Record<string, boolean>;
  salaryRange: [number, number]; 
  searchTerm: string;
  industry: string;
  location: string;
  sortBy: 'newest' | 'relevant';
}

const Jobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const jobListingsRef = useRef<HTMLDivElement>(null);

  const initialFilters = {
    jobTypes: [] as string[],
    experienceLevels: [] as string[],
    salaryRange: [50, 150] as [number, number],
    searchTerm: '',
    industry: '',
    location: '',
    sortBy: 'relevant' as 'newest' | 'relevant',
  };
  const [activeFilters, setActiveFilters] = useState<JobFilters>(initialFilters);
  const [activeJobTypes, setActiveJobTypes] = useState<Record<string, boolean>>({});
  const [activeExpLevels, setActiveExpLevels] = useState<Record<string, boolean>>({ 
    entry: false, 
    mid: false, 
    senior: false 
  });

  useEffect(() => {
    const selectedIndustry = localStorage.getItem('selectedIndustry');
    if (selectedIndustry) {
      setActiveFilters((prev) => ({
        ...prev,
        industry: selectedIndustry,
      }));
      localStorage.removeItem('selectedIndustry');
    }
  }, []);

  // Effect to sync checkboxes state with filter arrays
  useEffect(() => {
    // Convert job type checkboxes to array for API
    const jobTypesArray = Object.entries(activeJobTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);

    // Convert experience level checkboxes to array for API
    const expLevelsArray = Object.entries(activeExpLevels)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => level);

    setActiveFilters(prev => ({
      ...prev,
      jobTypes: jobTypesArray,
      experienceLevels: expLevelsArray
    }));
  }, [activeJobTypes, activeExpLevels]);

  const parsePostedDate = (postedStr: string): Date => {
    const now = new Date();
    if (postedStr.includes('day')) {
      const days = parseInt(postedStr.split(' ')[0], 10);
      const date = new Date();
      date.setDate(now.getDate() - days);
      return date;
    } else if (postedStr.includes('week')) {
      const weeks = parseInt(postedStr.split(' ')[0], 10);
      const date = new Date();
      date.setDate(now.getDate() - weeks * 7);
      return date;
    } else if (postedStr.includes('month')) {
      const months = parseInt(postedStr.split(' ')[0], 10);
      const date = new Date();
      date.setMonth(now.getMonth() - months);
      return date;
    } else if (postedStr.includes('hour')) {
      const hours = parseInt(postedStr.split(' ')[0], 10);
      const date = new Date();
      date.setHours(now.getHours() - hours);
      return date;
    }
    return now;
  };

  const handleFilterChange = (filters: Partial<JobFilters>) => {
    setActiveFilters(prev => ({ ...prev, ...filters }));
  };

  const handleJobTypeToggle = (type: string, isSelected: boolean) => {
    setActiveJobTypes(prev => ({
      ...prev,
      [type]: isSelected
    }));
  };

  const handleExpLevelToggle = (level: string, isSelected: boolean) => {
    setActiveExpLevels(prev => ({
      ...prev,
      [level]: isSelected
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters(initialFilters);
    setActiveJobTypes({});
    setActiveExpLevels({ entry: false, mid: false, senior: false });
  };

  const handleSortChange = (sortType: 'newest' | 'relevant') => {
    handleFilterChange({ sortBy: sortType });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (jobListingsRef.current) {
      jobListingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs', activeFilters],
    queryFn: () => fetchJobs(activeFilters),
  });

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <Layout>
      <section className="min-h-screen my-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-primary/10 text-primary">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>Job Listings</span>
            </div>
            <SectionHeading
              title="Find Your Perfect Role"
              subtitle="Browse our curated selection of jobs matched to your skills and experience."
              className="title:text-4xl title:font-bold subtitle:text-lg subtitle:mt-3"
            />
          </div>

          <div className="flex flex-col gap-6">
            <JobsHeader
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onJobTypeToggle={handleJobTypeToggle}
              onExpLevelToggle={handleExpLevelToggle}
              activeJobTypes={activeJobTypes}
              activeExpLevels={activeExpLevels}
            />

            <div className="w-full">
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="loader mb-4" />
                    <p className="text-muted-foreground">Finding the perfect jobs for you...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  <>
                    <div
                      ref={jobListingsRef}
                      className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
                    >
                      <p className="text-muted-foreground text-sm md:text-base font-medium">
                        Showing {jobs.length} jobs
                      </p>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant={activeFilters.sortBy === 'newest' ? 'default' : 'outline'}
                          size="sm"
                          className="h-11 px-5 rounded-xl shadow-sm transition-all text-sm font-medium"
                          onClick={() => handleSortChange('newest')}
                        >
                          Newest
                        </Button>
                        <Button
                          variant={activeFilters.sortBy === 'relevant' ? 'default' : 'outline'}
                          size="sm"
                          className="h-11 px-5 rounded-xl shadow-sm transition-all text-sm font-medium"
                          onClick={() => handleSortChange('relevant')}
                        >
                          Relevant
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                      {currentJobs.map((job) => (
                        <Link
                          key={job.id}
                          to={`/jobs/${job.id}`}
                          className="block transition-transform hover:-translate-y-1"
                        >
                          <JobCard
                            job={job}
                            onIndustryClick={(industry) => handleFilterChange({ industry })}
                          />
                        </Link>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination>
                          <PaginationContent className="flex justify-center space-x-2 flex-wrap gap-2">
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(Math.max(1, currentPage - 1));
                                }}
                                className={`h-10 px-4 rounded-lg shadow-sm transition-all bg-background border-border ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                  }`}
                              />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(i + 1);
                                  }}
                                  isActive={currentPage === i + 1}
                                  className="h-10 w-10 flex items-center justify-center rounded-lg shadow-sm transition-all bg-background border-border"
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(Math.min(totalPages, currentPage + 1));
                                }}
                                className={`h-10 px-4 rounded-lg shadow-sm transition-all bg-background border-border ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                                  }`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-background border border-border rounded-xl p-8 text-center shadow-sm">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No jobs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms to find more jobs.
                    </p>
                    <Button
                      onClick={handleResetFilters}
                      className="h-12 px-6 rounded-lg shadow-md transition-all bg-primary hover:bg-primary/90"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Jobs;
