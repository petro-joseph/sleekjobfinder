// components/jobs/JobsList.tsx
import { memo } from 'react';
import { JobCard } from './JobCard';
import { LoadingState } from './LoadingState';

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
        return <LoadingState />;
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

            {isFetchingNextPage && (
                <div className="py-4 text-center">
                    <LoadingSpinner />
                    <p className="text-sm text-muted-foreground mt-2">
                        Loading more jobs...
                    </p>
                </div>
            )}
        </div>
    );
});

JobsList.displayName = 'JobsList';