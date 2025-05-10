
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobs, JobFilters } from '@/api/jobs';
import { useMemo } from 'react';
import { JobSearchResponse } from '@/types';

export const useJobSearch = (filters: JobFilters) => {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['jobs', filters],
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
    refetchOnReconnect: false
  });

  // Memoize the flattened jobs array to prevent unnecessary re-renders
  const jobs = useMemo(() => {
    return data?.pages.flatMap(page => page.jobs) || [];
  }, [data?.pages]);

  return { 
    jobs, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  };
};
