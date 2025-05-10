
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
  ]
};

/**
 * Preload a group of routes in low-priority
 */
export const preloadRouteGroup = (groupKey: keyof typeof routeGroups) => {
  if ('requestIdleCallback' in window) {
    // Use requestIdleCallback to load during browser idle time
    window.requestIdleCallback(() => {
      routeGroups[groupKey].forEach(importFn => {
        importFn().catch(err => {
          console.error(`Failed to preload route in group ${groupKey}:`, err);
        });
      });
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      routeGroups[groupKey].forEach(importFn => {
        importFn().catch(err => {
          console.error(`Failed to preload route in group ${groupKey}:`, err);
        });
      });
    }, 1000);
  }
};

/**
 * Preload a specific route
 */
export const preloadRoute = (importFn: () => Promise<any>) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      importFn().catch(err => {
        console.error('Failed to preload route:', err);
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch(err => {
        console.error('Failed to preload route:', err);
      });
    }, 300);
  }
};
