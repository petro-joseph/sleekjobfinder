
import { Helmet } from 'react-helmet-async';
import { formatSEODescription } from '@/utils/seo';
import { JobFilters } from '@/api/jobs';

interface JobsMetadataProps {
  filters: JobFilters;
  totalJobs: number;
}

export const JobsMetadata = ({ filters, totalJobs }: JobsMetadataProps) => {
  // Generate SEO title based on filters
  const generateTitle = (): string => {
    const parts = [];
    
    if (filters.searchTerm) {
      parts.push(filters.searchTerm);
    }
    
    if (filters.location) {
      parts.push(`in ${filters.location}`);
    }
    
    if (filters.industry) {
      parts.push(`${filters.industry} Industry`);
    }
    
    if (parts.length === 0) {
      return "Find Your Perfect Job | SleekJobs";
    }
    
    return `${parts.join(' ')} Jobs | SleekJobs`;
  };
  
  return (
    <Helmet>
      <title>{generateTitle()}</title>
      <meta name="description" content={formatSEODescription(filters, totalJobs)} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={generateTitle()} />
      <meta property="og:description" content={formatSEODescription(filters, totalJobs)} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={generateTitle()} />
      <meta name="twitter:description" content={formatSEODescription(filters, totalJobs)} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://sleekjobs.com/jobs${filters.searchTerm ? `?q=${filters.searchTerm}` : ''}`} />
    </Helmet>
  );
};
