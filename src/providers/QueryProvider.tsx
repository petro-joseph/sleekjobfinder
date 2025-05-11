import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Optimized global query provider with performance-tuned settings
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // Create a query client instance for each component tree
  // This ensures isolated query caches when the component remounts
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Improve UX by not showing loading indicators for fast queries
        refetchOnWindowFocus: false,
        // Keep cached data valid for 5 minutes by default
        staleTime: 1000 * 60 * 5,
        // Keep cached data for 10 minutes even when unused
        gcTime: 1000 * 60 * 10,
        // Retry failed queries 3 times with exponential backoff
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Use suspense mode for route components that support it
        // suspense: true, // We'll handle suspense at the route level instead
      },
      mutations: {
        // Retry failed mutations once with a short delay
        retry: 1,
        retryDelay: 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
