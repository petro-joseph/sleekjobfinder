
import { ArrowRight, Briefcase, LightbulbIcon, Rocket, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import Layout from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-primary/10 text-primary animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>AI-Powered Job Search Platform</span>
            </div>
            
            <h1 className="heading-xl mb-6 animate-fade-in">
              Find Your Dream Job with the Power of AI
            </h1>
            
            <p className="paragraph text-lg mb-8 max-w-xl mx-auto animate-fade-in">
              SleekJobs uses advanced AI to find perfect job matches, optimize your resume, and automate applications so you can focus on landing interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full group">
                <Link to="/jobs" className="flex items-center">
                  Explore Jobs
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-fade-in">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-primary mb-1">20,000+</p>
              <p className="text-muted-foreground">Available Jobs</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-primary mb-1">93%</p>
              <p className="text-muted-foreground">Interview Success</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-primary mb-1">15 Days</p>
              <p className="text-muted-foreground">Average Hiring Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Revolutionize Your Job Search"
            subtitle="Our AI-powered platform streamlines every aspect of your job hunt, from finding the right opportunities to landing interviews."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Smart Job Matching"
              description="Our AI analyzes your skills and preferences to find jobs that are the perfect fit for your career goals."
            />
            <FeatureCard
              icon={<Briefcase className="w-6 h-6" />}
              title="AI Resume Tailoring"
              description="Automatically optimize your resume for each job application to pass ATS systems and impress hiring managers."
            />
            <FeatureCard
              icon={<Rocket className="w-6 h-6" />}
              title="One-Click Apply"
              description="Apply to multiple jobs with a single click, saving you hours of repetitive form filling and application tracking."
            />
            <FeatureCard
              icon={<LightbulbIcon className="w-6 h-6" />}
              title="Interview Preparation"
              description="Get personalized interview tips and practice questions based on the specific job and company."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Career Insights"
              description="Access salary data, company reviews, and industry trends to make informed career decisions."
            />
            <FeatureCard
              icon={<ArrowRight className="w-6 h-6" />}
              title="Auto Application Tracking"
              description="Never lose track of your applications with our automated tracking and follow-up reminders."
            />
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/resume-builder">
                Try Our Resume Builder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="How SleekJobs Works"
            subtitle="Our streamlined process helps you land your dream job faster than traditional methods."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">Upload your resume or build one from scratch using our AI-powered tools.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Get Matched Jobs</h3>
              <p className="text-muted-foreground">Our AI finds and prioritizes jobs that match your skills, experience, and preferences.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Apply with Confidence</h3>
              <p className="text-muted-foreground">Apply with optimized materials or use our auto-apply feature to maximize your chances.</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Success Stories"
            subtitle="Hear from job seekers who have transformed their careers with SleekJobs."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.slice(0, 4).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="heading-lg mb-6 max-w-2xl mx-auto">Ready to Transform Your Job Search?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who have found their dream jobs faster with SleekJobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-white border-white/20 hover:bg-white/10">
              <Link to="/resume-builder">Build Your Resume</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
