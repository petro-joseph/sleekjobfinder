import React from 'react';
import { Job } from '@/data/jobs';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface JobsSidebarProps {
  jobs: Job[];
  totalJobs: number;
  isLoading: boolean;
  selectedJobId: string | null;
  onJobSelect: (jobId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeFilters: {
    sortBy: string;
    [key: string]: any;
  };
  onFilterChange: (filters: any) => void;
}

const JobsSidebar = ({
  jobs,
  totalJobs,
  isLoading,
  selectedJobId,
  onJobSelect,
  currentPage,
  totalPages,
  onPageChange,
  activeFilters,
  onFilterChange
}: JobsSidebarProps) => {
  
  const handleSortChange = (value: string) => {
    onFilterChange({ sortBy: value });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => onPageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
      <div className="bg-primary/10 p-4 border-b">
        <h3 className="font-semibold text-lg mb-2">Auto-Apply</h3>
        <p className="text-muted-foreground text-sm mb-3">
          Apply to all matching jobs with one click
        </p>
        <Button size="sm" className="w-full">Subscribe</Button>
      </div>

      <div className="p-4 flex items-center justify-between border-b">
        <p className="text-sm font-medium">
          {totalJobs} {totalJobs === 1 ? 'job' : 'jobs'} found
        </p>
        <div className="flex items-center">
          <Select value={activeFilters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Most recent</SelectItem>
              <SelectItem value="relevant">Most relevant</SelectItem>
              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
              <SelectItem value="salary-low">Salary: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="loader mb-4" />
            <p className="text-muted-foreground text-sm">Finding jobs...</p>
          </div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 cursor-pointer transition-all hover:bg-accent/20 ${
                  selectedJobId === job.id ? 'border-l-4 border-primary bg-accent/10' : ''
                }`}
                onClick={() => onJobSelect(job.id)}
              >
                <h3 className="font-semibold text-base mb-1">{job.title}</h3>
                <p className="text-sm mb-1">{job.company}</p>
                <p className="text-sm text-muted-foreground mb-2">{job.salary}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" /> {job.location}
                  <span className="mx-2">•</span>
                  <Briefcase className="h-3 w-3 mr-1" /> {job.type}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Posted {job.postedAt}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No jobs found matching your criteria</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onFilterChange({
                jobTypes: {},
                experienceLevels: {},
                salaryRange: [50, 150],
                searchTerm: '',
                industry: '',
                datePosted: '',
                location: '',
                sortBy: 'newest'
              })}
            >
              Clear filters
            </Button>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="border-t p-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default JobsSidebar;
