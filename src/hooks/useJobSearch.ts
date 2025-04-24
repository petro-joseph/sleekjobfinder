
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/api/jobs';
import { JobFilters } from '@/api/jobs';

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
    queryFn: ({ pageParam = 1 }) => fetchJobs({...filters, page: pageParam}),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
