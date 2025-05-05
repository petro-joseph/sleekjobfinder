import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Search, X, Filter, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import JobFilter from '@/components/JobFilter';
import { JobFilters } from '@/api/jobs';

export interface JobsHeaderProps {
  filters: JobFilters;
  onFilterChange: (newFilters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
  onJobTypeToggle: (type: string, isSelected: boolean) => void;
  onExpLevelToggle: (level: string, isSelected: boolean) => void;
  jobTypes: Record<string, boolean>;
  expLevels: Record<string, boolean>;
  isPending?: boolean; // Added the missing isPending prop
}

const JobsHeader: React.FC<JobsHeaderProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onJobTypeToggle,
  onExpLevelToggle,
  jobTypes,
  expLevels,
  isPending,
}) => {
  const formSchema = z.object({
    search: z.string().optional(),
    location: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: filters.search || '',
      location: filters.location || '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFilterChange({
      search: values.search,
      location: values.location,
    });
  };

  const handleReset = () => {
    form.reset();
    onResetFilters();
  };

  return (
    <div className="bg-background py-6 md:py-8 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Find Your Dream Job</h1>
          <Badge variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Badge>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search job title or keywords"
                {...form.register('search')}
                className="flex h-11 w-full rounded-md border border-input bg-background px-10 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Location"
                {...form.register('location')}
                className="flex h-11 w-full rounded-md border border-input bg-background px-10 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <JobFilter
              title="Job Type"
              options={jobTypes}
              onToggle={onJobTypeToggle}
            />
          </div>
          <div>
            <JobFilter
              title="Experience Level"
              options={expLevels}
              onToggle={onExpLevelToggle}
            />
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary/50 h-10 px-4 py-2"
          >
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsHeader;
