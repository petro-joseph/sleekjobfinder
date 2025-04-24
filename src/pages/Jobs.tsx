
// pages/Jobs.tsx
import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useJobFilters } from '@/hooks/useJobFilters';
import { useJobSearch } from '@/hooks/useJobSearch';
import { JobsList } from '@/components/jobs/JobsList';
import { JobsHeader } from '@/components/jobs/JobsHeader';
import { JobsMetadata } from '@/components/jobs/JobsMetadata';
import { JobsErrorBoundary } from '@/components/jobs/JobsErrorBoundary';
import { LoadingState } from '@/components/jobs/LoadingState';
import { ErrorState } from '@/components/jobs/ErrorState';
import { analytics } from '@/lib/analytics';
import { JOBS_PER_PAGE } from '@/constants';
import type { Job } from '@/types';
import { fetchJobs } from '@/api/jobs';
import { seedJobs } from '@/utils/seed';

const Jobs = () => {
  // Custom hooks for managing state and functionality
  const {
    filters,
    jobTypes,
    expLevels,
    updateFilters,
    resetFilters,
    setJobTypes,
    setExpLevels,
  } = useJobFilters();

  const {
    jobs,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useJobSearch(filters);

  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const jobListingsRef = useRef<HTMLDivElement>(null);

  // Run seeding once on initial load
  useEffect(() => {
    seedJobs().catch(err => console.error('Error seeding jobs:', err));
  }, []);

  // Infinite scroll setup
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Prefetch next page of results
  useEffect(() => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ['jobs', filters, nextPage],
        queryFn: () => fetchJobs({ ...filters, page: nextPage }),
      });
    }
  }, [currentPage, filters, hasNextPage, queryClient]);

  // Analytics tracking
  useEffect(() => {
    analytics.track('Jobs Page View', {
      filters,
      totalJobs: jobs?.length || 0,
      currentPage,
    });
  }, [filters, jobs?.length, currentPage]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    updateFilters(newFilters);
    setCurrentPage(1);
    analytics.track('Filter Change', { newFilters });
  };

  const handleJobTypeToggle = (type: string, isSelected: boolean) => {
    setJobTypes((prev) => ({ ...prev, [type]: isSelected }));
    analytics.track('Job Type Toggle', { type, isSelected });
  };

  const handleExpLevelToggle = (level: string, isSelected: boolean) => {
    setExpLevels((prev) => ({ ...prev, [level]: isSelected }));
    analytics.track('Experience Level Toggle', { level, isSelected });
  };

  const handleResetFilters = () => {
    resetFilters();
    setCurrentPage(1);
    analytics.track('Filters Reset');
  };

  return (
    <JobsErrorBoundary>
      <Layout>
        <JobsMetadata filters={filters} totalJobs={jobs?.length || 0} />

        <section className="min-h-screen my-8 bg-background">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="max-w-3xl mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Find Your Perfect Role
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse our curated selection of jobs matched to your skills and experience.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <JobsHeader
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                onJobTypeToggle={handleJobTypeToggle}
                onExpLevelToggle={handleExpLevelToggle}
                jobTypes={jobTypes}
                expLevels={expLevels}
              />

              <main ref={jobListingsRef}>
                {error ? (
                  <ErrorState error={error} onRetry={() => fetchNextPage()} />
                ) : (
                  <JobsList
                    jobs={jobs || []}
                    isLoading={isLoading}
                    onIndustryClick={(industry) => handleFilterChange({ industry })}
                    loadMoreRef={loadMoreRef}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                )}
              </main>
            </div>
          </div>
        </section>
      </Layout>
    </JobsErrorBoundary>
  );
};

export default Jobs;
