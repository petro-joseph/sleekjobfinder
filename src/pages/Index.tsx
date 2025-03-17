import { useEffect } from 'react';
import { ArrowRight, Briefcase, LightbulbIcon, Rocket, Sparkles, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import Layout from '@/components/Layout';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from '@/components/ui/carousel'; // Updated import
import { useIsMobile } from '@/hooks/use-mobile';
import JobCardCompact from '@/components/JobCardCompact';
import { jobs } from '@/data/jobs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Index = () => {
  const isMobile = useIsMobile();
  const featuredJobs = jobs.slice(0, 5);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        className="pt-20 pb-16 md:pt-32 md:pb-28 relative overflow-hidden bg-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-gray-900 to-gray-900"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-primary/10 text-primary animate-pulse"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>AI-Powered Job Search Platform</span>
            </motion.div>

            <motion.h1
              className="heading-xl mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Find Your Dream Job with the Power of AI
            </motion.h1>

            <motion.p
              className="paragraph text-lg mb-8 max-w-xl mx-auto text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              SleekJobs uses advanced AI to find perfect job matches, optimize your resume, and automate applications so you can focus on landing interviews.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button">
                <Link to="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full group text-white border-primary/20 hover:bg-primary/10 touch-button">
                <Link to="/jobs" className="flex items-center">
                  Explore Jobs
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16"
              variants={sectionVariants}
              initial="hidden"
              animate="show"
            >
              {[
                { value: "20,000+", label: "Available Jobs", icon: <Briefcase className="w-5 h-5 text-primary" /> },
                { value: "93%", label: "Interview Success", icon: <Target className="w-5 h-5 text-primary" /> },
                { value: "15 Days", label: "Average Hiring Time", icon: <Rocket className="w-5 h-5 text-primary" /> },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Jobs Section */}
      <motion.section
        className="py-12 bg-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Featured Jobs"
            subtitle="Explore our latest opportunities handpicked for you"
            centered
            className="text-white"
          />

          <motion.div className="mt-8" variants={sectionVariants}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredJobs.map((job) => (
                  <CarouselItem key={job.id} className={isMobile ? "pl-2 basis-[90%]" : "pl-4 md:basis-1/2 lg:basis-1/3"}>
                    <motion.div
                      className="p-1"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <JobCardCompact
                        job={job}
                        className="h-full border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-300"
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className={isMobile ? "left-2" : "-left-12"} />
              <CarouselNext className={isMobile ? "right-2" : "-right-12"} />
              <CarouselDots className="mt-4" /> {/* Should now work */}
            </Carousel>
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button">
              <Link to="/jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Revolutionize Your Job Search"
            subtitle="Our AI-powered platform streamlines every aspect of your job hunt, from finding the right opportunities to landing interviews."
            centered
            className="text-white"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={sectionVariants}
          >
            {[
              { icon: <Target className="w-6 h-6" />, title: "Smart Job Matching", description: "Our AI analyzes your skills and preferences to find jobs that are the perfect fit for your career goals." },
              { icon: <Briefcase className="w-6 h-6" />, title: "AI Resume Tailoring", description: "Automatically optimize your resume for each job application to pass ATS systems and impress hiring managers." },
              { icon: <Rocket className="w-6 h-6" />, title: "One-Click Apply", description: "Apply to multiple jobs with a single click, saving you hours of repetitive form filling and application tracking." },
              { icon: <LightbulbIcon className="w-6 h-6" />, title: "Interview Preparation", description: "Get personalized interview tips and practice questions based on the specific job and company." },
              { icon: <Sparkles className="w-6 h-6" />, title: "Career Insights", description: "Access salary data, company reviews, and industry trends to make informed career decisions." },
              { icon: <ArrowRight className="w-6 h-6" />, title: "Auto Application Tracking", description: "Never lose track of your applications with our automated tracking and follow-up reminders." },
            ].map((feature, index) => (
              <motion.div key={feature.title} variants={cardVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
                <FeatureCard
                  icon={<div className="p-2 rounded-full bg-gradient-to-br from-primary to-primary/50">{feature.icon}</div>}
                  title={feature.title}
                  description={feature.description}
                  className="backdrop-blur-xl border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-300 text-white"
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button">
              <Link to="/resume-builder">
                Try Our Resume Builder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-6">
          <SectionHeading
            title="How SleekJobs Works"
            subtitle="Our streamlined process helps you land your dream job faster than traditional methods."
            centered
            className="text-white"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative"
            variants={sectionVariants}
          >
            {[
              { step: "1", title: "Create Your Profile", description: "Upload your resume or build one from scratch using our AI-powered tools." },
              { step: "2", title: "Get Matched Jobs", description: "Our AI finds and prioritizes jobs that match your skills, experience, and preferences." },
              { step: "3", title: "Apply with Confidence", description: "Apply with optimized materials or use our auto-apply feature to maximize your chances." },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center relative"
                variants={cardVariants}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < 2 && !isMobile && (
                  <ChevronRight className="absolute top-6 -right-4 text-primary/50 hidden md:block" size={24} />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button">
              <Link to="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 bg-gray-900 relative"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Success Stories"
            subtitle="Hear from job seekers who have transformed their careers with SleekJobs."
            centered
            className="text-white"
          />

          <motion.div className="mt-8" variants={sectionVariants}>
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className={isMobile ? "basis-[90%]" : "md:basis-1/2"}>
                    <motion.div
                      className="p-1"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TestimonialCard
                        quote={testimonial.quote}
                        author={testimonial.author}
                        role={testimonial.role}
                        company={testimonial.company}
                        avatar={testimonial.avatar}
                        className="h-full backdrop-blur-xl border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-300 text-white shadow-lg"
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className={isMobile ? "left-2" : "-left-12"} />
              <CarouselNext className={isMobile ? "right-2" : "-right-12"} />
              <CarouselDots className="mt-4" /> {/* Should now work */}
            </Carousel>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-primary to-primary/50 text-white relative"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="heading-lg mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ready to Transform Your Job Search?
          </motion.h2>
          <motion.p
            className="text-white/80 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Join thousands of job seekers who have found their dream jobs faster with SleekJobs.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90 touch-button animate-pulse">
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-white border-white/20 hover:bg-white/10 touch-button">
              <Link to="/resume-builder">Build Your Resume</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;