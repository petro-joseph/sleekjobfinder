
import Skeleton from 'react-loading-skeleton';
import { Loader2 } from "lucide-react";
import 'react-loading-skeleton/dist/skeleton.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const JobCardSkeleton = () => {
  return (
    <div className="p-5 md:p-6 border rounded-xl bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
};

export const JobDetailSkeleton = () => {
  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border">
      <div className="flex items-start gap-4">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

export const SavedJobsSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 border rounded-xl bg-card">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex justify-between mt-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton width={120} /></TableCell>
    <TableCell><Skeleton width={150} /></TableCell>
    <TableCell><Skeleton width={100} /></TableCell>
    <TableCell><Skeleton width={160} /></TableCell>
    <TableCell><Skeleton width={100} /></TableCell>
    <TableCell className="text-right">
      <Skeleton width={20} />
    </TableCell>
  </TableRow>
);

export const ApplicationTableSkeleton = () => (
  <div className="border rounded-lg overflow-auto max-h-[450px]">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(5).fill(0).map((_, index) => (
          <TableRowSkeleton key={index} />
        ))}
      </TableBody>
    </Table>
  </div>
);


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


export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
};
