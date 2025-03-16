
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';
import { useAuthStore } from '@/lib/store';
import MobileProfileBar from './MobileProfileBar';
import { useIsMobile } from '@/hooks/use-mobile';

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed bottom-6 right-6 z-50 md:bottom-6">
        <DarkModeToggle />
      </div>
      <Navbar />
      {isMobile && <MobileProfileBar />}
      <main className={`flex-grow ${isAuthenticated ? 'page-with-bottom-nav' : ''} ${!isMobile ? 'pt-24' : 'pt-12'}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
