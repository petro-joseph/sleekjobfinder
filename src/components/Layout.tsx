
import { useEffect, memo } from 'react';
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
import { Analytics } from "@vercel/analytics/react"

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
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        <main className={`flex-grow ${isAuthenticated ? 'page-with-bottom-nav' : ''} ${!isMobile ? 'pt-12' : 'pt-14 mt-4'
          } ${isDashboardOrPreferences && !isMobile ? 'pt-20' : ''
          }`}>
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
