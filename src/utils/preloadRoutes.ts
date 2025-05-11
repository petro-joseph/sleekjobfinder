
/**
 * Utility function to preload related routes based on the current route
 */

// Define a custom interface for Navigator with connection property
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export const preloadRelatedRoutes = (path: string) => {
  // Only preload if we're not on a slow connection
  if (navigator.connection &&
    ('saveData' in navigator.connection ||
      navigator.connection.effectiveType === '2g' ||
      navigator.connection.effectiveType === 'slow-2g')) {
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

/**
 * Utility function to preload a group of related routes
 */
export const preloadRouteGroup = (group: string) => {
  // Define route groups for common user flows
  const routeGroups: Record<string, string[]> = {
    'jobs': ['JobDetail', 'Apply', 'SavedJobs'],
    'dashboard': ['Progress', 'Profile', 'SavedJobs'],
    'profile': ['ManageResumes', 'UserPreferences'],
    'auth': ['Dashboard', 'Profile']
  };

  // Only preload if we're not on a slow connection
  if (navigator.connection &&
    ('saveData' in navigator.connection ||
      navigator.connection.effectiveType === '2g' ||
      navigator.connection.effectiveType === 'slow-2g')) {
    return; // Skip preloading on slow connections
  }

  const pagesToPreload = routeGroups[group] || [];
  
  // Create a small queue to stagger preloads
  if (pagesToPreload.length > 0) {
    let index = 0;
    const preloadNext = () => {
      if (index < pagesToPreload.length) {
        import(`../pages/${pagesToPreload[index]}.tsx`).catch(() => {
          // Silently fail on preload errors
        }).finally(() => {
          index++;
          setTimeout(preloadNext, 300); // Stagger preloads
        });
      }
    };

    // Start preloading with delay
    setTimeout(preloadNext, 300);
  }
};
