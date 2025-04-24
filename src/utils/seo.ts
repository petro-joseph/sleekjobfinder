
import { JobFilters } from "@/api/jobs";

export const formatSEODescription = (filters: JobFilters, totalJobs: number): string => {
  const parts = [];

  if (filters.searchTerm) {
    parts.push(`${filters.searchTerm}`);
  }

  if (filters.location) {
    parts.push(`in ${filters.location}`);
  }

  if (filters.industry) {
    parts.push(`in the ${filters.industry} industry`);
  }

  let base = `Browse ${totalJobs}+ ${parts.join(' ')} jobs`;
  
  if (filters.jobTypes && filters.jobTypes.length > 0) {
    base += ` with ${filters.jobTypes.join(', ')} positions`;
  }

  return `${base}. Find your perfect role today with SleekJobs - your career partner for professional growth.`;
};
