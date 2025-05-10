
import { useState, useEffect, memo } from 'react';
import { LoadingSpinner } from './LoadingState';

interface DelayedLoaderProps {
  isLoading: boolean;
  minDelay?: number; // Minimum time to show loader to prevent flash
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional custom fallback component
}

/**
 * Optimized loading component that prevents loading flash
 * by ensuring loader stays visible for at least minDelay ms
 */
export const DelayedLoader = memo(({ 
  isLoading, 
  minDelay = 300, 
  children, 
  fallback 
}: DelayedLoaderProps) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  
  useEffect(() => {
    let timer: number;
    
    if (!isLoading && shouldRender) {
      // If content is loaded but we're still showing the loader,
      // set a minimum delay before hiding the loader to prevent flash
      timer = window.setTimeout(() => {
        setShouldRender(false);
      }, minDelay);
    } else if (isLoading && !shouldRender) {
      // If loading started again, show the loader immediately
      setShouldRender(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, shouldRender, minDelay]);
  
  if (shouldRender) {
    return fallback ? <>{fallback}</> : <LoadingSpinner />;
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
  fallback?: React.ReactNode; // Optional custom fallback component
  minDuration?: number; // Minimum time to show the loader once displayed
}

export const LoadingBoundary = memo(({ 
  isLoading, 
  delay = 150, 
  children, 
  fallback,
  minDuration = 500
}: LoadingBoundaryProps) => {
  const [showLoader, setShowLoader] = useState(false);
  const [loaderShownTime, setLoaderShownTime] = useState<number | null>(null);
  
  useEffect(() => {
    let delayTimer: number;
    let durationTimer: number;
    
    if (isLoading && !showLoader) {
      // Only show loader if loading takes longer than the delay
      delayTimer = window.setTimeout(() => {
        if (isLoading) {
          setShowLoader(true);
          setLoaderShownTime(Date.now());
        }
      }, delay);
    } 
    
    if (!isLoading && showLoader && loaderShownTime) {
      // Ensure loader stays visible for minDuration once shown
      const elapsedTime = Date.now() - loaderShownTime;
      const remainingTime = Math.max(0, minDuration - elapsedTime);
      
      if (remainingTime > 0) {
        durationTimer = window.setTimeout(() => {
          setShowLoader(false);
          setLoaderShownTime(null);
        }, remainingTime);
      } else {
        setShowLoader(false);
        setLoaderShownTime(null);
      }
    }
    
    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (durationTimer) clearTimeout(durationTimer);
    };
  }, [isLoading, showLoader, delay, minDuration, loaderShownTime]);
  
  if (isLoading && showLoader) {
    return fallback ? <>{fallback}</> : <LoadingSpinner />;
  }
  
  // During initial delay while loading, render nothing or a placeholder
  if (isLoading) {
    return null; // Or return a minimal placeholder if needed
  }
  
  return <>{children}</>;
});

LoadingBoundary.displayName = 'LoadingBoundary';
