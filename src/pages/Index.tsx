import { useEffect } from 'react';
import { ArrowRight, Briefcase, LightbulbIcon, Rocket, Sparkles, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import Layout from '@/components/Layout';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from '@/components/ui/carousel';
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
        className="pt-16 pb-12 md:pt-24 md:pb-20 relative overflow-hidden bg-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-gray-900 to-gray-900"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center px-3 py-1 mb-4 md:mb-6 text-sm rounded-full bg-primary/10 text-primary animate-pulse"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>AI-Powered Job Search</span>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover Your Dream Job with AI
            </motion.h1>

            <motion.p
              className="text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              SleekJobs uses AI to match you with perfect jobs, optimize your resume, and streamline applications.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button w-full sm:w-auto">
                <Link to="/signup">Start for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full group text-white border-primary/20 hover:bg-primary/10 touch-button w-full sm:w-auto">
                <Link to="/jobs" className="flex items-center">
                  Browse Jobs
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mt-8 md:mt-12"
              variants={sectionVariants}
              initial="hidden"
              animate="show"
            >
              {[
                { value: "20,000+", label: "Available Jobs", icon: <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary" /> },
                { value: "93%", label: "Interview Success", icon: <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" /> },
                { value: "15 Days", label: "Avg. Hire Time", icon: <Rocket className="w-4 h-4 md:w-5 md:h-5 text-primary" /> },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-3 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-center mb-1 md:mb-2">{stat.icon}</div>
                  <p className="text-lg md:text-2xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Jobs Section */}
      <motion.section
        className="py-10 bg-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Featured Jobs"
            subtitle="Discover opportunities tailored for you"
            centered
            className="text-white"
          />

          <motion.div className="mt-6" variants={sectionVariants}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredJobs.map((job) => (
                  <CarouselItem key={job.id} className={isMobile ? "pl-2 basis-[85%]" : "pl-4 md:basis-1/2 lg:basis-1/3"}>
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
              <CarouselPrevious className={isMobile ? "left-1" : "-left-12"} />
              <CarouselNext className={isMobile ? "right-1" : "-right-12"} />
              <CarouselDots className="mt-4" />
            </Carousel>
          </motion.div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button w-full sm:w-auto">
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
        className="py-10 bg-gray-900"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Supercharge Your Job Hunt"
            subtitle="Leverage AI to find jobs, optimize resumes, and land interviews faster."
            centered
            className="text-white"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            variants={sectionVariants}
          >
            {[
              { icon: <Target className="w-5 h-5 md:w-6 md:h-6" />, title: "Smart Job Matching", description: "AI finds jobs that align with your skills and goals." },
              { icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />, title: "AI Resume Tailoring", description: "Optimize your resume for ATS and hiring managers." },
              { icon: <Rocket className="w-5 h-5 md:w-6 md:h-6" />, title: "One-Click Apply", description: "Apply to jobs effortlessly with a single click." },
              { icon: <LightbulbIcon className="w-5 h-5 md:w-6 md:h-6" />, title: "Interview Prep", description: "Personalized tips and practice for your interviews." },
              { icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6" />, title: "Career Insights", description: "Access salary data, reviews, and industry trends." },
              { icon: <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />, title: "Application Tracking", description: "Track applications with automated reminders." },
            ].map((feature, index) => (
              <motion.div key={feature.title} variants={cardVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
                <FeatureCard
                  icon={<div className="p-2 rounded-full bg-gradient-to-br from-primary to-primary/50">{feature.icon}</div>}
                  title={feature.title}
                  description={feature.description}
                  className="backdrop-blur-xl border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-300 text-white h-full"
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button w-full sm:w-auto">
              <Link to="/resume-builder">
                Build Your Resume Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-10 bg-gradient-to-br from-gray-900 to-gray-800 relative"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="How It Works"
            subtitle="A simple process to get you hired faster."
            centered
            className="text-white"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative mt-6"
            variants={sectionVariants}
          >
            {[
              { step: "1", title: "Create Profile", description: "Upload or build your resume with AI tools." },
              { step: "2", title: "Get Matched", description: "AI finds jobs tailored to your skills." },
              { step: "3", title: "Apply Easily", description: "Use optimized resumes to apply with confidence." },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center relative"
                variants={cardVariants}
              >
                <div className="bg-primary/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold text-sm md:text-base">{step.step}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                {index < 2 && !isMobile && (
                  <ChevronRight className="absolute top-6 -right-4 text-primary/50 hidden md:block" size={24} />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 touch-button w-full sm:w-auto">
              <Link to="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-10 bg-gray-900 relative"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Success Stories"
            subtitle="See how SleekJobs has transformed careers."
            centered
            className="text-white"
          />

          <motion.div className="mt-6" variants={sectionVariants}>
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className={isMobile ? "basis-[85%]" : "md:basis-1/2"}>
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
              <CarouselPrevious className={isMobile ? "left-1" : "-left-12"} />
              <CarouselNext className={isMobile ? "right-1" : "-right-12"} />
              <CarouselDots className="mt-4" />
            </Carousel>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-12 bg-gradient-to-br from-primary to-primary/50 text-white relative"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.h2
            className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 max-w-2xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Start Your Job Search Today
          </motion.h2>
          <motion.p
            className="text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto text-white/80 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Join thousands who’ve landed their dream jobs with SleekJobs’ AI tools.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90 touch-button animate-pulse w-full sm:w-auto">
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-white border-white/20 hover:bg-white/10 touch-button w-full sm:w-auto">
              <Link to="/resume-builder">Optimize Your Resume</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;