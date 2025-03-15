
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthStore } from '@/lib/store';

const Footer = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuthStore();

  // If user is authenticated and on mobile, don't render the footer
  if (isMobile && isAuthenticated) {
    return null;
  }

  return (
    <footer className="bg-secondary py-16">
      <div className="container mx-auto px-6">
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-8' : 'grid-cols-1 md:grid-cols-5 gap-10'}`}>
          {/* Brand column - full width on mobile */}
          <div className={`${isMobile ? 'col-span-2' : 'md:col-span-2'} mb-8`}>
            <Link to="/" className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SleekJobs
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md text-center md:text-left">
              Connecting talented professionals with their dream careers through our AI-powered job platform.
            </p>
            <p className="mt-6 text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SleekJobs. All rights reserved.
            </p>
          </div>

          {/* Navigation columns - 2-column grid on mobile */}
          <div>
            <h3 className="font-semibold mb-4 text-center md:text-left">Platform</h3>
            <ul className="space-y-3">
              <FooterLink href="/jobs">Find Jobs</FooterLink>
              <FooterLink href="/resume-builder">Resume Builder</FooterLink>
              <FooterLink href="/auto-apply">Auto-Apply</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-center md:text-left">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/guides">Career Guides</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
            </ul>
          </div>

          <div className={isMobile ? '' : 'hidden md:block'}>
            <h3 className="font-semibold mb-4 text-center md:text-left">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <li className="text-center md:text-left">
      <Link 
        to={href} 
        className="text-muted-foreground hover:text-foreground transition-colors link-hover inline-block"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;
