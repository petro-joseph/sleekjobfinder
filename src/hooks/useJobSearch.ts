
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobs, JobFilters } from '@/api/jobs';
import { useCallback, useMemo } from 'react';
import { JobSearchResponse } from '@/types';

/**
 * Enhanced hook for job searches with performance optimizations
 */
export const useJobSearch = (filters: JobFilters) => {
  // Memoize the query key based on filters to prevent unnecessary re-renders
  const queryKey = useMemo(() => ['jobs', filters], [filters]);
  
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchJobs({ 
      ...filters, 
      page: pageParam as number,
      limit: 10 // You can adjust this or make it configurable
    }),
    getNextPageParam: (lastPage: JobSearchResponse) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: true,
    refetchOnReconnect: false,
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
  });

  // Memoize the flattened jobs array to prevent unnecessary re-renders
  const jobs = useMemo(() => {
    return data?.pages.flatMap(page => page.jobs) || [];
  }, [data?.pages]);
  
  // Memoized function to refresh the search with the same filters
  const refreshSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  return { 
    jobs, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refreshSearch
  };
};

/**
 * Hook specifically for fetching a limited set of featured jobs
 * with optimized caching settings
 */
export const useFeaturedJobs = (limit: number = 3) => {
  const filters: JobFilters = useMemo(() => ({
    jobTypes: [],
    experienceLevels: [],
    salaryRange: [50, 150],
    searchTerm: '',
    industry: '',
    location: '',
    sortBy: 'newest', // Changed from 'featured' to 'newest' to match the allowed values
    datePosted: '',
    featured: true, // Use this property to filter featured jobs instead
  }), []);
  
  return useInfiniteQuery({
    queryKey: ['featuredJobs', limit],
    queryFn: ({ pageParam = 1 }) => fetchJobs({ 
      ...filters, 
      page: pageParam as number,
      limit
    }),
    getNextPageParam: () => undefined, // No pagination for featured jobs
    staleTime: 1000 * 60 * 10, // 10 minutes - featured jobs change less frequently
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true, 
    refetchOnReconnect: false,
    gcTime: 1000 * 60 * 30, // Keep featured jobs in cache longer (30 minutes)
  });
};
