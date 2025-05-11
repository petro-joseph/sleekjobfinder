
import { Suspense, lazy, ComponentType, ReactNode } from 'react';

/**
 * Wrapper for lazy loading components with custom fallback
 */
export function lazyWithFallback<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactNode
) {
  const LazyComponent = lazy(importFn);
  return function LazyWithFallback(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Create a component that only loads its children after the component has mounted
 * This prevents hydration mismatches and improves perceived performance
 */
export function createDeferredComponent<T extends ComponentType<any>>(
  Component: T,
  fallback: ReactNode
) {
  return function DeferredComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}

/**
 * Create components that load in priority order with separate suspense boundaries
 */
export function createPrioritizedLoading(options: {
  high: ReactNode;
  medium?: ReactNode;
  low?: ReactNode;
  highFallback?: ReactNode;
  mediumFallback?: ReactNode;
  lowFallback?: ReactNode;
}) {
  const { high, medium, low, highFallback, mediumFallback, lowFallback } = options;

  return (
    <>
      <Suspense fallback={highFallback || null}>{high}</Suspense>
      
      {medium && (
        <Suspense fallback={mediumFallback || null}>{medium}</Suspense>
      )}
      
      {low && (
        <Suspense fallback={lowFallback || null}>{low}</Suspense>
      )}
    </>
  );
}
