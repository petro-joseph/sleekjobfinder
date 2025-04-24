
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { JobFilters } from '@/api/jobs';

// Define initial filters
const initialFilters: JobFilters = {
  jobTypes: [],
  experienceLevels: [],
  salaryRange: [50, 150],
  searchTerm: '',
  industry: '',
  location: '',
  sortBy: 'newest',
  datePosted: ''
};

export const useJobFilters = () => {
  const [savedFilters, setSavedFilters] = useLocalStorage('jobFilters', initialFilters);
  const [filters, setFilters] = useState<JobFilters>(savedFilters);

  const [jobTypes, setJobTypes] = useState<Record<string, boolean>>({});
  const [expLevels, setExpLevels] = useState<Record<string, boolean>>({
    entry: false,
    mid: false,
    senior: false,
  });

  useEffect(() => {
    setSavedFilters(filters);
  }, [filters, setSavedFilters]);

  const updateFilters = (newFilters: Partial<JobFilters>) => {
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
