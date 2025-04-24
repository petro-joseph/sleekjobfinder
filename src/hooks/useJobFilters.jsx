// hooks/useJobFilters.ts
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useJobFilters = () => {
    const [savedFilters, setSavedFilters] = useLocalStorage('jobFilters', initialFilters);
    const [filters, setFilters] = useState(savedFilters);

    const [jobTypes, setJobTypes] = useState < Record < string, boolean>> ({});
    const [expLevels, setExpLevels] = useState < Record < string, boolean>> ({
        entry: false,
        mid: false,
        senior: false,
    });

    useEffect(() => {
        setSavedFilters(filters);
    }, [filters, setSavedFilters]);

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        setJobTypes({});
        setExpLevels({ entry: false, mid: false, senior: false });
    };

    return {
        filters,
        jobTypes,
        expLevels,
        updateFilters,
        resetFilters,
        setJobTypes,
        setExpLevels,
    };
};

// hooks/useJobSearch.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/api/jobs';

export const useJobSearch = (filters: JobFilters) => {
    return useInfiniteQuery({
        queryKey: ['jobs', filters],
        queryFn: ({ pageParam = 1 }) => fetchJobs(filters, pageParam),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasMore ? pages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
    });
};