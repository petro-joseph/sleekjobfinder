
/**
 * Utility to preload routes intelligently
 */

// Define common route groups to preload together
const routeGroups = {
  auth: [
    () => import('../pages/Login'),
    () => import('../pages/Signup'),
    () => import('../pages/Dashboard')
  ],
  jobs: [
    () => import('../pages/Jobs'),
    () => import('../pages/JobDetail'),
    () => import('../pages/SavedJobs')
  ],
  resume: [
    () => import('../pages/ResumeBuilder'),
    () => import('../pages/ManageResumes')
  ],
  guides: [
    () => import('../pages/guides/ResumeGuide'),
    () => import('../pages/guides/InterviewGuide'),
    () => import('../pages/guides/SalaryGuide')
  ],
  // New combined group for better navigation performance
  application: [
    () => import('../pages/Apply'),
    () => import('../pages/Progress'),
    () => import('../pages/Dashboard')
  ]
};

/**
 * Enhanced preload for route groups with better error handling and performance
 */
export const preloadRouteGroup = (groupKey: keyof typeof routeGroups) => {
  const startPreload = () => {
    console.log(`Preloading route group: ${groupKey}`);
    
    // Use Promise.allSettled to handle errors gracefully without blocking other imports
    Promise.allSettled(
      routeGroups[groupKey].map(importFn => importFn())
    ).then(results => {
      // Log only the failed imports for debugging
      const failedImports = results.filter(r => r.status === 'rejected');
      if (failedImports.length > 0) {
        console.warn(`${failedImports.length} routes failed to preload in group ${groupKey}`);
      }
    });
  };
  
  if ('requestIdleCallback' in window) {
    // Use requestIdleCallback with a shorter timeout for better responsiveness
    window.requestIdleCallback(startPreload, { timeout: 1500 });
  } else {
    // Improved fallback with a shorter timeout
    setTimeout(startPreload, 800);
  }
};

/**
 * Preload a specific route with performance optimizations
 */
export const preloadRoute = (importFn: () => Promise<any>) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      importFn().catch(err => {
        console.error('Failed to preload route:', err);
      });
    }, { timeout: 1000 }); // Added timeout for better responsiveness
  } else {
    setTimeout(() => {
      importFn().catch(err => {
        console.error('Failed to preload route:', err);
      });
    }, 300);
  }
};

/**
 * Intelligently preload routes based on user behavior
 * @param currentPath - The current route path
 */
export const preloadRelatedRoutes = (currentPath: string) => {
  // Type-safe check for navigator.connection
  const connection = 'connection' in navigator ? (navigator as any).connection : null;
  
  // Don't preload on slow connections or if data saver is enabled
  if (connection && 
     (connection.saveData || 
      connection.effectiveType === '2g' || 
      connection.effectiveType === 'slow-2g')) {
    return;
  }

  // Determine which routes to preload based on current path
  if (currentPath.startsWith('/jobs')) {
    preloadRouteGroup('jobs');
  } else if (currentPath.startsWith('/resume') || currentPath === '/manage-resumes') {
    preloadRouteGroup('resume');
  } else if (currentPath === '/login' || currentPath === '/signup') {
    preloadRouteGroup('auth');
  } else if (currentPath.includes('/guide')) {
    preloadRouteGroup('guides');
  } else if (currentPath.startsWith('/apply') || currentPath === '/progress') {
    preloadRouteGroup('application');
  }
};
