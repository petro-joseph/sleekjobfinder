
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';
import { useAuthStore } from '@/lib/store';
import MobileProfileBar from './MobileProfileBar';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from './BottomNav';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDashboardOrPreferences = 
    location.pathname === '/dashboard' || 
    location.pathname === '/user-preferences';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Update dark mode based on user's device preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Only apply system preference if user hasn't set a preference
    if (!savedTheme) {
      if (darkModeMediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) { // Only respond to system changes if user hasn't set preference
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      };
      
      darkModeMediaQuery.addEventListener('change', handleChange);
      return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return (
    <SkeletonTheme
      baseColor={theme === 'dark' ? '#2a2a2a' : '#ebebeb'}
      highlightColor={theme === 'dark' ? '#333333' : '#f5f5f5'}
    >
      <div className="flex flex-col min-h-screen">
        <div className="fixed bottom-6 right-6 z-50 md:bottom-6 mb-16 md:mb-0">
          <DarkModeToggle className="w-12 h-12 scale-110" />
        </div>
        <Navbar />
        {isAuthenticated && isMobile && <MobileProfileBar />}
        <main className={`flex-grow ${isAuthenticated ? 'page-with-bottom-nav' : ''} ${
          !isMobile ? 'pt-12' : 'pt-14 mt-4'
        } ${
          isDashboardOrPreferences && !isMobile ? 'pt-20' : ''
        }`}>
          {children}
        </main>
        {!hideFooter && <Footer />}
        {isAuthenticated && <BottomNav />}
      </div>
    </SkeletonTheme>
  );
};

export default Layout;

