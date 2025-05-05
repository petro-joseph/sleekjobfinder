
import { Skeleton } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export const JobCardSkeleton = () => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex justify-between items-center mt-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const JobDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      
      <div className="flex justify-start gap-3">
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>
    </div>
  );
};

export const SavedJobsSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Skeleton className="w-12 h-12 rounded-md mr-4" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-8 w-28 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const ApplicationsSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                <Skeleton className="h-8 w-28 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { Skeleton };
