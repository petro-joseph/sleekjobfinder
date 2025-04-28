
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { JobFilters } from '@/api/jobs';

// Define initial filters
const initialFilters: JobFilters = {
  jobTypes: [],
  experienceLevels: [],
  salaryRange: [50, 150], // Default range, adjust if needed
  searchTerm: '',
  industry: '',
  location: '',
  sortBy: 'newest',
  datePosted: '',
};

// Helper to initialize state from filters
const initializeRecordFromFilter = (filterArray: string[] | undefined): Record<string, boolean> => {
  const record: Record<string, boolean> = {};
  if (filterArray) {
    filterArray.forEach(item => {
      record[item] = true;
    });
  }
  return record;
};

// Helper to initialize experience levels state from filters
const initializeExpLevelsFromFilter = (filterArray: string[] | undefined): Record<string, boolean> => {
  const initialExpLevels = { entry: false, mid: false, senior: false };
  if (filterArray) {
    filterArray.forEach(level => {
      if (level in initialExpLevels) {
        initialExpLevels[level as keyof typeof initialExpLevels] = true;
      }
    });
  }
  return initialExpLevels;
};


export const useJobFilters = () => {
  const [savedFilters, setSavedFilters] = useLocalStorage<JobFilters>('jobFilters', initialFilters);
  const [filters, setFilters] = useState<JobFilters>(savedFilters);

  // Initialize jobTypes and expLevels based on saved filters
  const [jobTypes, setJobTypes] = useState<Record<string, boolean>>(
      () => initializeRecordFromFilter(savedFilters.jobTypes)
  );
  const [expLevels, setExpLevels] = useState<Record<string, boolean>>(
      () => initializeExpLevelsFromFilter(savedFilters.experienceLevels)
  );

  // Effect to update filters when jobTypes change
  useEffect(() => {
    const activeJobTypes = Object.entries(jobTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
    setFilters(prev => {
      // Only update if the array content actually changed
      if (JSON.stringify(prev.jobTypes) !== JSON.stringify(activeJobTypes)) {
        return { ...prev, jobTypes: activeJobTypes };
      }
      return prev;
    });
  }, [jobTypes]);

  // Effect to update filters when expLevels change
   useEffect(() => {
    const activeExpLevels = Object.entries(expLevels)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => level);
     setFilters(prev => {
       // Only update if the array content actually changed
       if (JSON.stringify(prev.experienceLevels) !== JSON.stringify(activeExpLevels)) {
           return { ...prev, experienceLevels: activeExpLevels };
       }
       return prev;
     });
  }, [expLevels]);

  // Effect to save filters to local storage whenever they change
  useEffect(() => {
    setSavedFilters(filters);
  }, [filters, setSavedFilters]);

 const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
     setFilters((prev) => {
         const updatedFilters = { ...prev, ...newFilters };

         // If experienceLevels are updated directly, sync expLevels state
         if ('experienceLevels' in newFilters) {
             setExpLevels(initializeExpLevelsFromFilter(newFilters.experienceLevels));
         }
          // If jobTypes are updated directly, sync jobTypes state
         if ('jobTypes' in newFilters) {
              setJobTypes(initializeRecordFromFilter(newFilters.jobTypes));
         }
         
         // Ensure specific filters are correctly updated or cleared
          if (newFilters.industry !== undefined) {
              updatedFilters.industry = newFilters.industry;
          }
          if (newFilters.location !== undefined) {
              updatedFilters.location = newFilters.location;
          }
           if (newFilters.datePosted !== undefined) {
              updatedFilters.datePosted = newFilters.datePosted;
           }
           if (newFilters.salaryRange !== undefined) {
              updatedFilters.salaryRange = newFilters.salaryRange;
           }
             if (newFilters.searchTerm !== undefined) {
              updatedFilters.searchTerm = newFilters.searchTerm;
           }


         return updatedFilters;
     });
  }, [setFilters, setExpLevels, setJobTypes]);


  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setJobTypes({});
    setExpLevels({ entry: false, mid: false, senior: false });
    setSavedFilters(initialFilters); // Explicitly clear local storage too
  }, [setSavedFilters]);

  return {
    filters,
    jobTypes,
    expLevels,
    updateFilters,
    resetFilters,
    setJobTypes, // Expose setters if direct manipulation is needed from components
    setExpLevels,
  };
};
