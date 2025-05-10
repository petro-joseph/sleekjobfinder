
import { useEffect, memo, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuthStore } from '@/lib/store';
import MobileProfileBar from './MobileProfileBar';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from './BottomNav';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { preloadRelatedRoutes } from '@/utils/preloadRoutes';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

// Memoize layout components for better performance
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);
const MemoizedBottomNav = memo(BottomNav);
const MemoizedMobileProfileBar = memo(MobileProfileBar);
const MemoizedDarkModeToggle = memo(DarkModeToggle);

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isMobile = useIsMobile();

  const isDashboardOrPreferences =
    location.pathname === '/dashboard' ||
    location.pathname === '/user-preferences';
  
  // Enhanced scroll to top with smoother behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);
  
  // Preload related routes when navigating
  useEffect(() => {
    preloadRelatedRoutes(location.pathname);
  }, [location.pathname]);

  // Memoized class name calculation for performance
  const mainClassName = useCallback(() => {
    let className = 'flex-grow';
    
    if (isAuthenticated) {
      className += ' page-with-bottom-nav';
    }
    
    if (!isMobile) {
      className += ' pt-12';
    } else {
      className += ' pt-14 mt-4';
    }
    
    if (isDashboardOrPreferences && !isMobile) {
      className += ' pt-20';
    }
    
    return className;
  }, [isAuthenticated, isMobile, isDashboardOrPreferences]);

  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base-color)"
      highlightColor="var(--skeleton-highlight-color)"
    >
      <div className="flex flex-col min-h-screen">
        <div className="fixed bottom-6 right-6 z-50 md:bottom-6 mb-16 md:mb-0">
          <MemoizedDarkModeToggle className="w-12 h-12 scale-110" />
        </div>
        <MemoizedNavbar />
        {isAuthenticated && isMobile && <MemoizedMobileProfileBar />}
        <main className={mainClassName()}>
          {children}
        </main>
        {!hideFooter && <MemoizedFooter />}
        {isAuthenticated && <MemoizedBottomNav />}
        <SpeedInsights />
        <Analytics />
      </div>
    </SkeletonTheme>
  );
};

export default memo(Layout);
