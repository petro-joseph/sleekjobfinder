
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Job } from '@/data/jobs';
import JobsSidebar from '@/components/jobs/JobsSidebar';
import JobDetails from '@/components/jobs/JobDetails';
import JobsHeader from '@/components/jobs/JobsHeader';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs, fetchJobById } from '@/api/jobs';

const Jobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [activeFilters, setActiveFilters] = useState({
    jobTypes: {} as Record<string, boolean>,
    experienceLevels: {} as Record<string, boolean>,
    salaryRange: [50, 150] as [number, number],
    searchTerm: '',
    industry: '',
    datePosted: '',
    location: '',
    sortBy: 'newest'
  });

  // Fetch jobs using React Query
  const { 
    data: allJobs = [], 
    isLoading: isJobsLoading,
    refetch 
  } = useQuery({
    queryKey: ['jobs', activeFilters],
    queryFn: () => fetchJobs(activeFilters),
  });

  // Fetch specific job if ID is provided
  const { 
    data: selectedJob, 
    isLoading: isSelectedJobLoading 
  } = useQuery({
    queryKey: ['job', selectedJobId],
    queryFn: () => selectedJobId ? fetchJobById(selectedJobId) : null,
    enabled: !!selectedJobId
  });

  // Apply filters to jobs
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // Set the first job as selected if none is selected
  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  // Handle URL parameter for job ID
  useEffect(() => {
    if (id) {
      setSelectedJobId(id);
    }
  }, [id]);

  useEffect(() => {
    // Check for industry selection from job detail page
    const selectedIndustry = localStorage.getItem('selectedIndustry');
    if (selectedIndustry) {
      setActiveFilters(prev => ({
        ...prev,
        industry: selectedIndustry
      }));
      localStorage.removeItem('selectedIndustry');
      refetch(); // Refetch with new filter
    }
  }, [refetch]);

  // Update filtered jobs when allJobs changes
  useEffect(() => {
    if (allJobs) {
      setFilteredJobs(allJobs);
      setIsLoading(false);
    }
  }, [allJobs]);

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
      ...filters
    };
    
    setActiveFilters(newFilters);
  };

  const handleResetFilters = () => {
    setActiveFilters({
      jobTypes: {},
      experienceLevels: {},
      salaryRange: [50, 150],
      searchTerm: '',
      industry: '',
      datePosted: '',
      location: '',
      sortBy: 'newest'
    });
    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
    });
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    navigate(`/jobs/${jobId}`, { replace: true });
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section with Search and Filters */}
        <JobsHeader 
          activeFilters={activeFilters} 
          onFilterChange={handleFilterChange} 
          onResetFilters={handleResetFilters}
        />
        
        {/* Main Two-Column Layout */}
        <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Job List */}
          <div className="w-full lg:w-1/3 lg:max-w-md">
            <JobsSidebar 
              jobs={currentJobs}
              totalJobs={filteredJobs.length}
              isLoading={isJobsLoading || isLoading}
              selectedJobId={selectedJobId}
              onJobSelect={handleJobSelect}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Right Content Area - Job Details */}
          <div className="w-full lg:w-2/3 lg:border-l lg:pl-6">
            {isSelectedJobLoading ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="loader mb-4" />
              </div>
            ) : selectedJob ? (
              <JobDetails job={selectedJob} />
            ) : (
              <div className="h-full flex items-center justify-center p-8 bg-secondary/20 rounded-lg">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">No job selected</h3>
                  <p className="text-muted-foreground">Select a job from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
