
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
          <div className="mt-4 flex space-x-2">
            <Skeleton height={36} width={100} />
            <Skeleton height={36} width={100} />
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
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton height={50} count={4} />
        <Skeleton height={50} count={4} />
      </div>
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

export const JobDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton circle width={60} height={60} />
        <div className="space-y-2 flex-1">
          <Skeleton height={28} width="70%" />
          <Skeleton height={20} width="50%" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton width={80} height={24} />
        <Skeleton width={100} height={24} />
        <Skeleton width={90} height={24} />
      </div>
      <Skeleton height={200} />
      <div>
        <Skeleton height={24} width="30%" className="mb-2" />
        <Skeleton count={5} />
      </div>
      <div>
        <Skeleton height={24} width="30%" className="mb-2" />
        <Skeleton count={3} />
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton height={20} width={100} />
        <Skeleton height={40} />
      </div>
      <div className="space-y-2">
        <Skeleton height={20} width={120} />
        <Skeleton height={40} />
      </div>
      <div className="space-y-2">
        <Skeleton height={20} width={140} />
        <Skeleton height={100} />
      </div>
      <Skeleton height={45} width={120} />
    </div>
  );
};

export const SearchResultsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start">
            <div className="mr-3">
              <Skeleton circle width={40} height={40} />
            </div>
            <div className="flex-1">
              <Skeleton height={20} width="60%" />
              <div className="mt-1">
                <Skeleton height={16} width="40%" />
              </div>
              <div className="mt-3 flex space-x-2">
                <Skeleton height={16} width={60} />
                <Skeleton height={16} width={80} />
                <Skeleton height={16} width={70} />
              </div>
            </div>
            <Skeleton height={30} width={80} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton circle width={24} height={24} />
          <Skeleton width="80%" height={20} />
        </div>
      ))}
    </div>
  );
};
