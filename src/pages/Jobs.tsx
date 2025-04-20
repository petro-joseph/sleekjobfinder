import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import JobCard from '@/components/JobCard';
import JobsHeader from '@/components/jobs/JobsHeader';
import { jobs, Job } from '@/data/jobs';
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

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const jobListingsRef = useRef<HTMLDivElement>(null); // Reference to the job listings section

  const initialFilters = {
    jobTypes: {} as Record<string, boolean>,
    experienceLevels: { entry: false, mid: false, senior: false } as Record<string, boolean>,
    salaryRange: [50, 150] as [number, number],
    searchTerm: '',
    industry: '',
    datePosted: '',
    location: '',
    sortBy: 'relevant',
  };
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  useEffect(() => {
    const selectedIndustry = localStorage.getItem('selectedIndustry');
    if (selectedIndustry) {
      setActiveFilters((prev) => ({
        ...prev,
        industry: selectedIndustry,
      }));
      localStorage.removeItem('selectedIndustry');
    }
    applyFilters(activeFilters);
  }, []);

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

  const applyFilters = (filters: typeof activeFilters) => {
    setIsLoading(true);

    setTimeout(() => {
      let filtered = [...jobs];

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (job) =>
            job.title.toLowerCase().includes(searchLower) ||
            job.company.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters.datePosted && filters.datePosted !== 'any') {
        const now = new Date();
        filtered = filtered.filter((job) => {
          const postedDate = parsePostedDate(job.postedAt);
          switch (filters.datePosted) {
            case '24h':
              return (now.getTime() - postedDate.getTime()) <= 24 * 60 * 60 * 1000;
            case '7d':
              return (now.getTime() - postedDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            case '14d':
              return (now.getTime() - postedDate.getTime()) <= 14 * 24 * 60 * 60 * 1000;
            case '30d':
              return (now.getTime() - postedDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            default:
              return true;
          }
        });
      }

      if (filters.location) {
        filtered = filtered.filter((job) =>
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      const activeExperienceLevels = Object.entries(filters.experienceLevels)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      if (activeExperienceLevels.length > 0) {
        filtered = filtered.filter((job) =>
          activeExperienceLevels.some((level) =>
            job.tags.some((tag) => tag.toLowerCase().includes(level.toLowerCase()))
          )
        );
      }

      filtered = filtered.filter((job) => {
        const salaryStr = job.salary.replace(/[^0-9-]/g, '');
        const [min, max] = salaryStr.split('-').map((s) => parseInt(s.trim(), 10));
        const avgSalary = (min + max) / 2;
        return (
          avgSalary >= filters.salaryRange[0] * 1000 &&
          avgSalary <= filters.salaryRange[1] * 1000
        );
      });

      if (filters.industry) {
        filtered = filtered.filter((job) => job.industry === filters.industry);
      }

      if (filters.sortBy === 'newest') {
        filtered.sort((a, b) => {
          const dateA = parsePostedDate(a.postedAt);
          const dateB = parsePostedDate(b.postedAt);
          return dateB.getTime() - dateA.getTime();
        });
      } else if (filters.sortBy === 'relevant') {
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          const dateA = parsePostedDate(a.postedAt);
          const dateB = parsePostedDate(b.postedAt);
          return dateB.getTime() - dateA.getTime();
        });
      }

      setFilteredJobs(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  const handleFilterChange = (filters: Partial<typeof activeFilters>) => {
    const newFilters = { ...activeFilters, ...filters };
    setActiveFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    setActiveFilters(initialFilters);
    applyFilters(initialFilters);
  };

  const handleSortChange = (sortType: 'newest' | 'relevant') => {
    handleFilterChange({ sortBy: sortType });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top of the job listings section
    if (jobListingsRef.current) {
      jobListingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <Layout>
      <section className="min-h-screen my-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Header Section */}
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

          {/* Main Content */}
          <div className="flex flex-col gap-6">
            {/* JobsHeader */}
            <JobsHeader
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            {/* Job Listings */}
            <div className="w-full">
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="loader mb-4" />
                    <p className="text-muted-foreground">Finding the perfect jobs for you...</p>
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <>
                    <div
                      ref={jobListingsRef} // Reference to scroll to this section
                      className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
                    >
                      <p className="text-muted-foreground text-sm md:text-base font-medium">
                        Showing {filteredJobs.length} jobs
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