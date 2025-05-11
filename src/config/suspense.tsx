
import React, { ReactNode } from 'react';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { JobPageSkeleton } from '@/components/jobs/JobPageSkeleton';
import { JobDetailSkeleton } from '@/components/jobs/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Route-based suspense configuration
 * Maps route paths to their corresponding skeleton components
 */
export const routeSuspenseConfig: Record<string, React.ReactNode> = {
  '/': <DashboardSkeleton />,
  '/dashboard': <DashboardSkeleton />,
  '/jobs': <JobPageSkeleton />,
  '/jobs/:id': <JobDetailSkeleton />,
  '/saved-jobs': <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-10 w-64 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                      ))}
                    </div>
                 </div>,
  '/progress': <div className="container mx-auto px-4 py-8">
                  <Skeleton className="h-10 w-64 mb-4" />
                  <div className="space-y-4">
                    {Array(4).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
               </div>,
  '/career-assistant': <div className="container mx-auto px-4 py-8">
                          <Skeleton className="h-10 w-64 mb-4" />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <Skeleton className="h-96 w-full" />
                            </div>
                            <Skeleton className="h-96 w-full" />
                          </div>
                       </div>,
  '/manage-resumes': <div className="container mx-auto px-4 py-8">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <div className="space-y-4">
                          {Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                          ))}
                        </div>
                     </div>,
  // Add more routes as needed
};

/**
 * Get the appropriate suspense fallback for a given route path
 */
export const getSuspenseFallback = (path: string): ReactNode => {
  // Try exact match first
  if (routeSuspenseConfig[path]) {
    return routeSuspenseConfig[path];
  }

  // Handle dynamic routes like '/jobs/:id'
  const dynamicRouteMatch = Object.keys(routeSuspenseConfig).find(route => {
    if (!route.includes(':')) return false;
    
    const routeParts = route.split('/');
    const pathParts = path.split('/');
    
    if (routeParts.length !== pathParts.length) return false;
    
    return routeParts.every((part, index) => {
      if (part.startsWith(':')) return true; // Any value is acceptable for params
      return part === pathParts[index];
    });
  });

  return dynamicRouteMatch 
    ? routeSuspenseConfig[dynamicRouteMatch]
    : <div className="container mx-auto p-8 flex justify-center">
        <div className="animate-pulse rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>;
};
