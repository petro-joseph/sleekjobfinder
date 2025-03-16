
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SleekJobs
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Connecting talented professionals with their dream careers through our AI-powered job platform.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              © {new Date().getFullYear()} SleekJobs. All rights reserved.
            </p>
          </div>

          {/* Navigation columns - mobile 2-column grid, desktop 3-column */}
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8 md:gap-0">
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <FooterLink href="/jobs">Find Jobs</FooterLink>
                <FooterLink href="/resume-builder">Resume Builder</FooterLink>
                <FooterLink href="/auto-apply">Auto-Apply</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/guides">Career Guides</FooterLink>
                <FooterLink href="/faq">FAQs</FooterLink>
                <FooterLink href="/support">Support</FooterLink>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 mt-6 md:mt-0">
              <h3 className="font-semibold mb-4">Company</h3>
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
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <li>
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
