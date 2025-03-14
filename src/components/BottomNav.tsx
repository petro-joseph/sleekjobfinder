
import { useLocation, Link } from 'react-router-dom';
import { Home, Briefcase, User, Bookmark, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Only show for authenticated users
  if (!isAuthenticated) return null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Define navigation items
  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      icon: Briefcase,
      label: 'Jobs',
      href: '/jobs',
      active: location.pathname === '/jobs' || location.pathname.startsWith('/jobs/'),
    },
    {
      icon: Bookmark,
      label: 'Saved',
      href: '/saved-jobs',
      active: location.pathname === '/saved-jobs',
    },
    {
      icon: BarChart,
      label: 'Progress',
      href: '/progress',
      active: location.pathname === '/progress',
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
      active: location.pathname === '/profile',
    },
  ];

  // Optional vibration feedback on navigation
  const handleNavClick = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className={`bottom-nav-container md:hidden transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <nav className="bottom-nav">
        <div className="flex justify-around items-center w-full h-full">
          {navItems.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "bottom-nav-item flex flex-col items-center justify-center w-full",
                      item.active && "bottom-nav-item-active"
                    )}
                    onClick={handleNavClick}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mb-1 transition-all",
                      item.active ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-[10px] transition-all",
                      item.active ? "text-primary font-medium" : "text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-1">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
