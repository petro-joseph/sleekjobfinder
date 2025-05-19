
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import UserAvatar from './UserAvatar';
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts

    try {
      setIsLoggingOut(true);

      // Call logout from store - this now updates state BEFORE calling Supabase
      await logout();

      // Show success message
      toast.success("Logged out successfully");

      // Navigate to home page after logout
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hideNavbarOnMobile = isAuthenticated;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${hideNavbarOnMobile ? 'md:block hidden' : ''
        } ${isScrolled ? 'glassmorphism py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-gradient font-display">
              KaziHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/jobs">Find Jobs</NavLink>
            <NavLink href="/resume-builder">Resume Builder</NavLink>
            {!isAuthenticated && <NavLink href="/pricing">Pricing</NavLink>}
            {!isAuthenticated && <NavLink href="/blog">Resources</NavLink>}
            {isAuthenticated && <NavLink href="/dashboard">Dashboard</NavLink>}
            {isAuthenticated && <NavLink href="/saved-jobs">Saved Jobs</NavLink>}
            {isAuthenticated && <NavLink href="/progress">Applications</NavLink>}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button
                  asChild
                  variant="ghost"
                  className="font-medium flex items-center gap-2 p-0"
                >
                  <Link to="/profile">
                    <UserAvatar className="h-8 w-8" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="font-medium flex items-center gap-2"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className="animate-pulse">Logging out...</span>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-medium">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="pill" variant="gradient" className="group">
                  <Link to="/signup" className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse-soft" />
                    Get started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {!hideNavbarOnMobile && (
            <button
              className="p-2 md:hidden rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glassmorphism animate-in slide-in">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink
                href="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Jobs
              </MobileNavLink>
              <MobileNavLink
                href="/resume-builder"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resume Builder
              </MobileNavLink>
              {!isAuthenticated && (
                <>
                  <MobileNavLink
                    href="/pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </MobileNavLink>
                  <MobileNavLink
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Resources
                  </MobileNavLink>
                </>
              )}
              {isAuthenticated && (
                <>
                  <MobileNavLink
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink
                    href="/saved-jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Saved Jobs
                  </MobileNavLink>
                  <MobileNavLink
                    href="/progress"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Applications
                  </MobileNavLink>
                  <MobileNavLink
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </MobileNavLink>
                </>
              )}
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full justify-center touch-button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full justify-center touch-button">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center touch-button">
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      to={href}
      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors link-hover"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  href,
  onClick,
  children
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode
}) => {
  return (
    <Link
      to={href}
      className="text-base font-medium py-2 transition-colors duration-200 hover:text-primary touch-button flex"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
