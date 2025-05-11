
/**
 * Utility function to preload related routes based on the current route
 */
export const preloadRelatedRoutes = (path: string) => {
  // Only preload if we're not on a slow connection
  if (navigator.connection &&
    ('saveData' in navigator.connection ||
      (navigator.connection as any).effectiveType === '2g' ||
      (navigator.connection as any).effectiveType === 'slow-2g')) {
    return; // Skip preloading on slow connections
  }

  // Preload routes related to current page
  const relatedRoutes: Record<string, string[]> = {
    '/': ['Jobs', 'Login', 'Signup'],
    '/jobs': ['JobDetail', 'Apply'],
    '/login': ['Dashboard', 'Profile'],
    '/signup': ['Dashboard', 'Profile'],
    '/dashboard': ['SavedJobs', 'Progress', 'Profile']
  };

  const routesToPreload = relatedRoutes[path] || [];

  // Create a small queue to stagger preloads
  if (routesToPreload.length > 0) {
    let index = 0;
    const preloadNext = () => {
      if (index < routesToPreload.length) {
        import(`../pages/${routesToPreload[index]}.tsx`).catch(() => {
          // Silently fail on preload errors
        }).finally(() => {
          index++;
          setTimeout(preloadNext, 300); // Stagger preloads
        });
      }
    };

    // Start preloading with delay
    setTimeout(preloadNext, 500);
  }
};
