
import { JobFilters } from '@/api/jobs';

export const formatSEODescription = (filters: JobFilters, totalJobs: number): string => {
  const parts = [];
  
  if (totalJobs > 0) {
    parts.push(`Browse ${totalJobs} job opportunities`);
  } else {
    parts.push('Browse job opportunities');
  }
  
  if (filters.searchTerm) {
    parts.push(`matching "${filters.searchTerm}"`);
  }
  
  if (filters.industry) {
    parts.push(`in the ${filters.industry} industry`);
  }
  
  if (filters.location) {
    parts.push(`in ${filters.location}`);
  }
  
  parts.push('on SleekJobs. Find your next career opportunity today!');
  
  return parts.join(' ');
};
