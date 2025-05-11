
/**
 * Utility for prefetching important route modules based on user context
 * This helps improve performance for common navigation patterns
 */

// Define route groups for more efficient prefetching
export const routeGroups = {
  jobs: [
    () => import('../pages/Jobs'),
    () => import('../pages/JobDetail'),
    () => import('../pages/Apply')
  ],
  dashboard: [
    () => import('../pages/Dashboard'),
    () => import('../pages/Progress'),
    () => import('../pages/SavedJobs')
  ],
  profile: [
    () => import('../pages/Profile'),
    () => import('../pages/UserPreferences'),
    () => import('../pages/ManageResumes')
  ],
  auth: [
    () => import('../pages/Login'),
    () => import('../pages/Signup'),
    () => import('../pages/VerifyOtp')
  ]
};

/**
 * Prefetch a group of related routes
 * @param groupName The name of the route group to prefetch
 */
export function preloadRouteGroup(groupName: keyof typeof routeGroups) {
  // Only prefetch if the browser is idle
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      const routes = routeGroups[groupName];
      if (!routes) return;
      
      // Stagger the prefetching to avoid overwhelming the browser
      routes.forEach((importFn, index) => {
        setTimeout(() => {
          importFn().catch(() => {
            // Silently ignore prefetch errors
          });
        }, index * 100);
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      const routes = routeGroups[groupName];
      if (!routes) return;
      
      routes.forEach((importFn, index) => {
        setTimeout(() => {
          importFn().catch(() => {
            // Silently ignore prefetch errors
          });
        }, index * 100);
      });
    }, 1000); // Wait for initial render to complete
  }
}

// Check for browser support of modern performance APIs
const supportsPerformanceAPI = typeof performance !== 'undefined' && 
                              typeof performance.mark === 'function';

/**
 * Mark route transitions for performance measurement
 */
export function markRouteTransition(from: string, to: string) {
  if (!supportsPerformanceAPI) return;
  
  const markName = `route-transition:${from}->${to}`;
  performance.mark(markName + ':start');
  
  // Mark the end of transition after the next frame renders
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      performance.mark(markName + ':end');
      performance.measure(markName, 
        markName + ':start', 
        markName + ':end'
      );
    });
  });
}

/**
 * Initialize route prefetching based on current page
 */
export function initializePrefetching(currentPath: string) {
  // Don't prefetch on slow connections
  if (navigator.connection && 
      (navigator.connection.saveData || 
       navigator.connection.effectiveType === '2g' ||
       navigator.connection.effectiveType === 'slow-2g')) {
    return;
  }
  
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      // Prefetch based on current location
      if (currentPath === '/' || currentPath === '/home') {
        preloadRouteGroup('jobs');
        preloadRouteGroup('auth');
      } else if (currentPath === '/login' || currentPath === '/signup') {
        preloadRouteGroup('dashboard');
      } else if (currentPath === '/dashboard') {
        preloadRouteGroup('jobs');
        preloadRouteGroup('profile');
      } else if (currentPath.startsWith('/jobs')) {
        preloadRouteGroup('dashboard');
      }
    });
  }
}
