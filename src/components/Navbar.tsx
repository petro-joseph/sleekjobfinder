
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SleekJobs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/jobs">Find Jobs</NavLink>
            <NavLink href="/resume-builder">Resume Builder</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/blog">Resources</NavLink>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="font-medium">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-in slide-in">
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
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button asChild variant="outline" className="w-full justify-center">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Desktop Nav Link
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

// Mobile Nav Link
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
      className="text-base font-medium py-2"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
