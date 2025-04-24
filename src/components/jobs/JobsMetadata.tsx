// components/jobs/JobsMetadata.tsx
import { Helmet } from 'react-helmet-async';
import { formatSEODescription } from '@/utils/seo';

interface JobsMetadataProps {
    filters: JobFilters;
    totalJobs: number;
}

export const JobsMetadata: React.FC<JobsMetadataProps> = ({ filters, totalJobs }) => {
    const title = getPageTitle(filters);
    const description = formatSEODescription(filters, totalJobs);
    const keywords = getKeywords(filters);

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Social Media */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "JobPosting",
                    "jobLocation": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": filters.location || "Multiple Locations"
                        }
                    },
                    "datePosted": new Date().toISOString(),
                    "employmentType": filters.jobTypes.join(", ") || "Multiple Types",
                    "description": description,
                    "title": title
                })}
            </script>

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <link rel="canonical" href={window.location.href} />
        </Helmet>
    );
};

const getPageTitle = (filters: JobFilters): string => {
    const parts = [];

    if (filters.searchTerm) {
        parts.push(filters.searchTerm);
    }
    if (filters.location) {
        parts.push(`in ${filters.location}`);
    }
    if (filters.industry) {
        parts.push(`- ${filters.industry}`);
    }

    return parts.length > 0
        ? `${parts.join(" ")} Jobs | Company Name`
        : "Find Your Perfect Role | Company Name";
};

const getKeywords = (filters: JobFilters): string => {
    const baseKeywords = [
        "jobs",
        "careers",
        "employment",
        "job search",
        "job listings",
        "career opportunities"
    ];

    const filterKeywords = [
        filters.searchTerm,
        filters.location,
        filters.industry,
        ...filters.jobTypes,
        ...filters.experienceLevels
    ].filter(Boolean);

    return [...baseKeywords, ...filterKeywords].join(", ");
};