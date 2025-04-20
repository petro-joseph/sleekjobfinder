
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { jobs, Job } from '@/data/jobs';
import JobsSidebar from '@/components/jobs/JobsSidebar';
import JobDetails from '@/components/jobs/JobDetails';
import JobsHeader from '@/components/jobs/JobsHeader';
import { useToast } from '@/hooks/use-toast';

const Jobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(id || null);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    }
    
    // Simulate API call
    const timer = setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 800);

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

      // Filter by date posted if set
      if (activeFilters.datePosted) {
        const now = new Date();
        let cutoffDate = new Date();
        
        switch(activeFilters.datePosted) {
          case '24h':
            cutoffDate.setHours(now.getHours() - 24);
            break;
          case '7d':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '14d':
            cutoffDate.setDate(now.getDate() - 14);
            break;
          case '30d':
            cutoffDate.setDate(now.getDate() - 30);
            break;
        }
        
        if (activeFilters.datePosted !== 'any') {
          filtered = filtered.filter(job => {
            const postedDate = parsePostedDate(job.postedAt);
            return postedDate >= cutoffDate;
          });
        }
      }

      // Filter by location if set
      if (activeFilters.location) {
        filtered = filtered.filter(job => 
          job.location.toLowerCase().includes(activeFilters.location.toLowerCase())
        );
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
      } else if (activeFilters.sortBy === 'salary-high') {
        filtered.sort((a, b) => {
          const salaryA = a.salary.replace(/[^0-9-]/g, '');
          const salaryB = b.salary.replace(/[^0-9-]/g, '');
          const [minA, maxA] = salaryA.split('-').map(s => parseInt(s.trim(), 10));
          const [minB, maxB] = salaryB.split('-').map(s => parseInt(s.trim(), 10));
          const avgA = (minA + maxA) / 2;
          const avgB = (minB + maxB) / 2;
          return avgB - avgA;
        });
      } else if (activeFilters.sortBy === 'salary-low') {
        filtered.sort((a, b) => {
          const salaryA = a.salary.replace(/[^0-9-]/g, '');
          const salaryB = b.salary.replace(/[^0-9-]/g, '');
          const [minA, maxA] = salaryA.split('-').map(s => parseInt(s.trim(), 10));
          const [minB, maxB] = salaryB.split('-').map(s => parseInt(s.trim(), 10));
          const avgA = (minA + maxA) / 2;
          const avgB = (minB + maxB) / 2;
          return avgA - avgB;
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
      ...filters
    };
    
    setActiveFilters(newFilters);
    setTimeout(() => applyFilters(), 0);
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
    setTimeout(() => applyFilters(), 0);
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

  // Find the selected job
  const selectedJob = selectedJobId
    ? jobs.find(job => job.id === selectedJobId)
    : currentJobs.length > 0
    ? currentJobs[0]
    : null;

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
              isLoading={isLoading}
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
            {selectedJob ? (
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
