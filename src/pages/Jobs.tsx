
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import { jobs, Job } from '@/data/jobs';
import { Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setFilteredJobs(jobs);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: any) => {
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      let filtered = [...jobs];
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          job => 
            job.title.toLowerCase().includes(searchLower) || 
            job.company.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by job type
      const activeJobTypes = Object.entries(filters.jobTypes)
        .filter(([_, value]) => value)
        .map(([key]) => key);
        
      if (activeJobTypes.length > 0) {
        filtered = filtered.filter(job => {
          const jobType = job.type.replace('-', '').toLowerCase();
          return activeJobTypes.some(type => {
            // Convert camelCase to lowercase without spaces
            const typeFormatted = type.replace(/([A-Z])/g, '').toLowerCase();
            return jobType.includes(typeFormatted);
          });
        });
      }
      
      // Filter by salary range
      filtered = filtered.filter(job => {
        const salaryStr = job.salary.replace(/[^0-9-]/g, '');
        const [min, max] = salaryStr.split('-').map(s => parseInt(s.trim(), 10));
        const avgSalary = (min + max) / 2;
        return avgSalary >= filters.salaryRange[0] * 1000 && avgSalary <= filters.salaryRange[1] * 1000;
      });
      
      setFilteredJobs(filtered);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-primary/10 text-primary">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>Job Listings</span>
            </div>
            
            <SectionHeading
              title="Find Your Perfect Role"
              subtitle="Browse our curated selection of jobs matched to your skills and experience. Use the filters to narrow your search."
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <JobFilter onFilterChange={handleFilterChange} />
            </div>
            
            <div className="lg:col-span-3 order-1 lg:order-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="loader mb-4" />
                  <p className="text-muted-foreground">Finding the perfect jobs for you...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-muted-foreground">Showing {filteredJobs.length} jobs</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Newest
                      </Button>
                      <Button variant="ghost" size="sm">
                        Relevant
                      </Button>
                    </div>
                  </div>
                  
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-secondary/50 rounded-lg p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find more jobs.
                  </p>
                  <Button onClick={() => handleFilterChange({
                    jobTypes: {},
                    salaryRange: [50, 150],
                    searchTerm: '',
                  })}>
                    Clear Filters
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
