
import { memo } from 'react';
import { JobCard } from './JobCard';
import { JobCardSkeleton, LoadingSpinner } from './LoadingState';
import { EmptyState } from './EmptyState';
import { Job } from '@/types';

interface JobsListProps {
    jobs: Job[];
    isLoading: boolean;
    onIndustryClick: (industry: string) => void;
    loadMoreRef: (node: HTMLElement | null) => void;
    isFetchingNextPage: boolean;
}

export const JobsList = memo<JobsListProps>(({
    jobs,
    isLoading,
    onIndustryClick,
    loadMoreRef,
    isFetchingNextPage,
}) => {
    if (isLoading && !jobs.length) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <JobCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!jobs.length) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                {jobs.map((job, index) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onIndustryClick={onIndustryClick}
                        ref={index === jobs.length - 5 ? loadMoreRef : null}
                    />
                ))}
            </div>

            {isFetchingNextPage && <LoadingSpinner />}
        </div>
    );
});

JobsList.displayName = 'JobsList';
