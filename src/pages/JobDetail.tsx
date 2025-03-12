
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  Clock,
  Building,
  DollarSign,
  ChevronLeft,
  CheckCircle,
  Share2,
  Bookmark,
  Tag
} from 'lucide-react';
import { jobs, Job } from '@/data/jobs';
import { SectionHeading } from '@/components/ui/section-heading';
import { toast } from 'sonner';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundJob = jobs.find(j => j.id === id);
      setJob(foundJob || null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleApply = () => {
    toast.success("Application submitted successfully!");
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    toast(isSaved ? "Job removed from saved jobs" : "Job saved to your profile");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const navigateToIndustryJobs = () => {
    if (job) {
      // Store the industry in localStorage to be picked up by the Jobs page
      localStorage.setItem('selectedIndustry', job.industry);
      // Navigate back to jobs
      window.location.href = '/jobs';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loader mb-4" />
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="bg-secondary/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/jobs">Back to Jobs</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Back navigation */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="group" size="sm">
            <Link to="/jobs">
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        {/* Job header */}
        <div className="bg-card rounded-xl p-8 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mr-6 text-primary font-semibold text-xl">
                {job.logo ? (
                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
                ) : (
                  job.company.substring(0, 2)
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{job.title}</h1>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground">{job.company}</span>
                  {job.featured && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSaveJob} variant={isSaved ? "secondary" : "outline"}>
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleApply}>
                Apply Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Job Type</p>
                <p className="font-medium">{job.type}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20 mt-1"
                  onClick={navigateToIndustryJobs}
                >
                  {job.industry}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Job content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Job description */}
            <div className="bg-card rounded-xl p-8 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-foreground/90 mb-6">{job.description}</p>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company info */}
            <div className="bg-card rounded-xl p-8 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">About {job.company}</h2>
              <p className="text-foreground/90">
                {job.company} is a leading company in its field, committed to innovation and growth.
                We offer competitive benefits, a collaborative work environment, and opportunities for
                professional development. Join our team and be part of our mission to transform the industry.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p>{job.postedAt}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p>{job.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salary Range</p>
                    <p>{job.salary}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p>{job.industry}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button onClick={handleApply} className="w-full">
                  Apply for this position
                </Button>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our career advisors can help you with your application and prepare for interviews.
              </p>
              <Button variant="outline" className="w-full">
                Get Career Advice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
