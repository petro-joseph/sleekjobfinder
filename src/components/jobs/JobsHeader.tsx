import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, X, Filter, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { JobFilter } from '@/components/JobFilter';
import { JobFilters } from '@/api/jobs';

export interface JobsHeaderProps {
  filters: JobFilters;
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  onJobTypeToggle: (type: string, isSelected: boolean) => void;
  onExpLevelToggle: (level: string, isSelected: boolean) => void;
  jobTypes: Record<string, boolean>;
  expLevels: Record<string, boolean>;
  isPending?: boolean; // Add isPending prop as optional
}

export const JobsHeader: React.FC<JobsHeaderProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onJobTypeToggle,
  onExpLevelToggle,
  jobTypes,
  expLevels,
  isPending,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ location: e.target.value });
  };

  const handleIndustryChange = (industry: string) => {
    onFilterChange({ industry });
  };

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-10 transition-all"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Location"
            className="pl-10 transition-all"
            value={filters.location || ''}
            onChange={handleLocationChange}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.industry && (
          <Badge variant="secondary">
            {filters.industry}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 -mr-1 h-5 w-5"
              onClick={() => onFilterChange({ industry: undefined })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove filter</span>
            </Button>
          </Badge>
        )}

        <JobFilter
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          onJobTypeToggle={onJobTypeToggle}
          onExpLevelToggle={onExpLevelToggle}
          jobTypes={jobTypes}
          expLevels={expLevels}
          isPending={isPending}
        />
      </div>
    </header>
  );
};
