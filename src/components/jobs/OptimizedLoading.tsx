
import { useState, useEffect, memo } from 'react';
import { LoadingSpinner } from './LoadingState';

interface DelayedLoaderProps {
  isLoading: boolean;
  minDelay?: number; // Minimum time to show loader to prevent flash
  children: React.ReactNode;
}

/**
 * Optimized loading component that prevents loading flash
 * by ensuring loader stays visible for at least minDelay ms
 */
export const DelayedLoader = memo(({ isLoading, minDelay = 300, children }: DelayedLoaderProps) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  
  useEffect(() => {
    if (!isLoading && shouldRender) {
      // If content is loaded but we're still showing the loader,
      // set a minimum delay before hiding the loader to prevent flash
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, minDelay);
      
      return () => clearTimeout(timer);
    } else if (isLoading && !shouldRender) {
      // If loading started again, show the loader immediately
      setShouldRender(true);
    }
  }, [isLoading, shouldRender, minDelay]);
  
  if (shouldRender) {
    return <LoadingSpinner />;
  }
  
  return <>{children}</>;
});

DelayedLoader.displayName = 'DelayedLoader';

/**
 * Optimized loading boundary that only shows loader after
 * a specified delay to prevent loading flash for fast loads
 */
interface LoadingBoundaryProps {
  isLoading: boolean;
  delay?: number; // Don't show loader until this many ms have passed
  children: React.ReactNode;
}

export const LoadingBoundary = memo(({ isLoading, delay = 150, children }: LoadingBoundaryProps) => {
  const [showLoader, setShowLoader] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      setShowLoader(false);
      return;
    }
    
    // Only show loader if loading takes longer than the delay
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowLoader(true);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isLoading, delay]);
  
  if (isLoading && showLoader) {
    return <LoadingSpinner />;
  }
  
  // During initial delay while loading, render nothing or a placeholder
  if (isLoading) {
    return null; // Or return a minimal placeholder if needed
  }
  
  return <>{children}</>;
});

LoadingBoundary.displayName = 'LoadingBoundary';
