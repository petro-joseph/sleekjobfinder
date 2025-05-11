
import React, { useState, useEffect, ReactNode } from 'react';

interface ProgressiveLoadProps {
  isLoading: boolean;
  skeleton: ReactNode;
  delay?: number;
  children: ReactNode;
}

/**
 * Component that shows skeleton during loading and smoothly transitions to content
 */
export const ProgressiveLoad = ({
  isLoading,
  skeleton,
  delay = 300,
  children
}: ProgressiveLoadProps) => {
  const [shouldRender, setShouldRender] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Add small delay for better perceived performance
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setShouldRender(false);
    }
  }, [isLoading, delay]);

  if (isLoading || !shouldRender) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
};

/**
 * Component that ensures content is only mounted once to prevent layout shifts
 */
export const InitialMount = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};
