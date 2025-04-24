
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const JobCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-6 mb-4">
      <div className="flex items-start">
        <div className="mr-4">
          <Skeleton circle width={48} height={48} />
        </div>
        <div className="flex-1">
          <Skeleton height={24} width="60%" />
          <div className="mt-2">
            <Skeleton height={20} width="40%" />
          </div>
          <div className="mt-4">
            <Skeleton height={16} count={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton circle width={64} height={64} />
        <div className="space-y-2">
          <Skeleton height={24} width={200} />
          <Skeleton height={20} width={150} />
        </div>
      </div>
      <Skeleton height={100} />
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton height={40} />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} height={50} />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="border rounded-lg p-6">
      <Skeleton height={24} width="40%" className="mb-4" />
      <Skeleton count={3} className="mb-2" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

