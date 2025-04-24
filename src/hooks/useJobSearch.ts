
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobs, JobFilters, JobSearchResponse } from '@/api/jobs';

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
    queryFn: ({ pageParam = 1 }) => fetchJobs({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage: JobSearchResponse) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1
  });

  // Flatten pages of results into a single array
  const jobs = data?.pages.flatMap(page => page.jobs) || [];

  return { 
    jobs, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  };
};
