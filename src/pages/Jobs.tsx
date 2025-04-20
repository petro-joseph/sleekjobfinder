import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import { jobs, Job } from '@/data/jobs';
import { Search, Briefcase, AlertCircle, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const [activeFilters, setActiveFilters] = useState({
    jobTypes: {} as Record<string, boolean>,
    experienceLevels: {} as Record<string, boolean>,
    salaryRange: [50, 150] as [number, number],
    searchTerm: '',
    industry: '',
    sortBy: 'relevant'
  });

  useEffect(() => {
    // Check for industry selection from job detail page
    const selectedIndustry = localStorage.getItem('selectedIndustry');
    if (selectedIndustry) {
      setActiveFilters(prev => ({
        ...prev,
        industry: selectedIndustry
      }));
      localStorage.removeItem('selectedIndustry');
    }
    
    // Simulate API call
    const timer = setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const applyFilters = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...jobs];
      
      // Filter by search term
      if (activeFilters.searchTerm) {
        const searchLower = activeFilters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          job => 
            job.title.toLowerCase().includes(searchLower) || 
            job.company.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by job type
      const activeJobTypes = Object.entries(activeFilters.jobTypes)
        .filter(([_, value]) => value)
        .map(([key]) => key);
        
      if (activeJobTypes.length > 0) {
        filtered = filtered.filter(job => {
          const jobType = job.type.replace('-', '').toLowerCase();
          return activeJobTypes.some(type => {
            const typeFormatted = type.replace(/([A-Z])/g, '').toLowerCase();
            return jobType.includes(typeFormatted);
          });
        });
      }
      
      // Filter by experience level
      const activeExperienceLevels = Object.entries(activeFilters.experienceLevels)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      if (activeExperienceLevels.length > 0) {
        filtered = filtered.filter(job => {
          // Check if any of the job tags contain the experience level
          return activeExperienceLevels.some(level => 
            job.tags.some(tag => tag.toLowerCase().includes(level.toLowerCase()))
          );
        });
      }
      
      // Filter by salary range
      filtered = filtered.filter(job => {
        const salaryStr = job.salary.replace(/[^0-9-]/g, '');
        const [min, max] = salaryStr.split('-').map(s => parseInt(s.trim(), 10));
        const avgSalary = (min + max) / 2;
        return avgSalary >= activeFilters.salaryRange[0] * 1000 && avgSalary <= activeFilters.salaryRange[1] * 1000;
      });
      
      // Filter by industry if set
      if (activeFilters.industry) {
        filtered = filtered.filter(job => job.industry === activeFilters.industry);
      }
      
      // Sort the jobs
      if (activeFilters.sortBy === 'newest') {
        filtered.sort((a, b) => {
          const dateA = parsePostedDate(a.postedAt);
          const dateB = parsePostedDate(b.postedAt);
          return dateB.getTime() - dateA.getTime();
        });
      } else if (activeFilters.sortBy === 'relevant') {
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          const dateA = parsePostedDate(a.postedAt);
          const dateB = parsePostedDate(b.postedAt);
          return dateB.getTime() - dateA.getTime();
        });
      }
      
      setFilteredJobs(filtered);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 500);
  };

  // Helper function to parse posted date strings
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
      date.setDate(now.getDate() - (weeks * 7));
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
    return now; // Default to now if format isn't recognized
  };

  const handleFilterChange = (filters: any) => {
    const newFilters = {
      ...activeFilters,
      jobTypes: filters.jobTypes,
      experienceLevels: filters.experienceLevels,
      salaryRange: filters.salaryRange,
      searchTerm: filters.searchTerm,
    };
    
    setActiveFilters(newFilters);
    setTimeout(() => applyFilters(), 0);
  };

  const handleIndustryClick = (industry: string) => {
    const newActiveFilters = {
      ...activeFilters,
      industry: activeFilters.industry === industry ? '' : industry // Toggle industry filter
    };
    
    setActiveFilters(newActiveFilters);
    setTimeout(() => applyFilters(), 0);
  };

  const clearIndustryFilter = () => {
    const newActiveFilters = {
      ...activeFilters,
      industry: ''
    };
    
    setActiveFilters(newActiveFilters);
    setTimeout(() => applyFilters(), 0);
  };
  
  const handleSortChange = (sortType: 'newest' | 'relevant') => {
    setActiveFilters({
      ...activeFilters,
      sortBy: sortType
    });
    setTimeout(() => applyFilters(), 0);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <Layout>
      {/* Hero Search Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Next Job Today
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Search through thousands of job listings to find your perfect role
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12"
                  value={activeFilters.searchTerm}
                  onChange={(e) => {
                    const newFilters = {
                      ...activeFilters,
                      searchTerm: e.target.value
                    };
                    setActiveFilters(newFilters);
                    setTimeout(() => applyFilters(), 0);
                  }}
                />
              </div>
              <Button className="h-12 px-8" size="lg">
                Search Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="lg:w-1/4">
              <JobFilter onFilterChange={handleFilterChange} />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="loader mb-4" />
                  <p className="text-muted-foreground">Finding the perfect jobs for you...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                <>
                  <div className="bg-card rounded-lg border p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <p className="text-muted-foreground">
                        Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                      </p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={activeFilters.sortBy === 'newest' ? "default" : "outline"} 
                          size="sm"
                          onClick={() => handleSortChange('newest')}
                        >
                          Newest
                        </Button>
                        <Button 
                          variant={activeFilters.sortBy === 'relevant' ? "default" : "outline"} 
                          size="sm"
                          onClick={() => handleSortChange('relevant')}
                        >
                          Relevant
                        </Button>
                      </div>
                    </div>

                    {activeFilters.industry && (
                      <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        <Badge className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {activeFilters.industry}
                          <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={clearIndustryFilter}
                            />
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {currentJobs.map(job => (
                      <Link
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        className="block transition-transform hover:-translate-y-1"
                      >
                        <JobCard job={job} onIndustryClick={handleIndustryClick} />
                      </Link>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find more jobs.
                  </p>
                  <Button onClick={() => {
                    setActiveFilters({
                      jobTypes: {},
                      experienceLevels: {},
                      salaryRange: [50, 150],
                      searchTerm: '',
                      industry: '',
                      sortBy: 'relevant'
                    });
                    setTimeout(() => applyFilters(), 0);
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Jobs;
