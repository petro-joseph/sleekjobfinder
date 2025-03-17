
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';
import { useAuthStore } from '@/lib/store';
import MobileProfileBar from './MobileProfileBar';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const isMobile = useIsMobile();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Update dark mode based on user's device preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModeMediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed bottom-6 right-6 z-50 md:bottom-6 mb-16 md:mb-0">
        <DarkModeToggle className="w-12 h-12 scale-110" />
      </div>
      <Navbar />
      {isAuthenticated && isMobile && <MobileProfileBar />}
      <main className={`flex-grow ${isAuthenticated ? 'page-with-bottom-nav' : ''} ${!isMobile ? 'pt-16' : 'pt-16 mt-2'}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      {isAuthenticated && <BottomNav />}
    </div>
  );
};

export default Layout;
