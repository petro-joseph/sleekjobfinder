
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Mail,
  MessageSquare
} from 'lucide-react';
import { jobs, Job } from '@/data/jobs';
import { JobPosting } from '@/types/resume'; // Import JobPosting type
import { SectionHeading } from '@/components/ui/section-heading';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from '@/lib/store';
import TailorResumeModal from '@/components/TailorResumeModal';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, saveJob, removeJob } = useAuthStore();
  const [tailorModalOpen, setTailorModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundJob = jobs.find(j => j.id === id);
      setJob(foundJob || null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleApply = () => {
    if (job) {
      navigate(`/apply/${job.id}`);
    }
  };

  const isSaved = user?.savedJobs.some(j => j.id === id) || false;

  const handleSaveJob = () => {
    if (!job) return;
    
    if (isSaved) {
      removeJob(job.id);
      toast("Job removed from saved jobs");
    } else {
      saveJob(job);
      toast("Job saved to your profile");
    }
  };

  const handleShare = (platform: string) => {
    if (!job) return;
    
    const url = window.location.href;
    const title = `${job.title} at ${job.company}`;
    const text = `Check out this job: ${title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this job posting: ${url}`)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ': ' + url)}`, '_blank');
        break;
      case 'copy':
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  const navigateToIndustryJobs = () => {
    if (job) {
      localStorage.setItem('selectedIndustry', job.industry);
      window.location.href = '/jobs';
    }
  };
  
  const handleTailorResume = () => {
    if (!user) {
      toast("Please login to tailor your resume");
      navigate('/login');
      return;
    }
    
    if (user.resumes.length === 0) {
      toast.warning("Please create a resume first", {
        description: "You'll be redirected to the preference page to create a resume.",
      });
      navigate('/preference');
      return;
    }
    
    setTailorModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-4 md:py-8">
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
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="bg-secondary/50 rounded-lg p-6 md:p-8 text-center">
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
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <Button asChild variant="ghost" className="group" size="sm">
            <Link to="/jobs">
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-secondary flex items-center justify-center mr-4 md:mr-6 text-primary font-semibold text-xl">
                {job?.logo ? (
                  <img src={job.logo} alt={job?.company} className="w-full h-full object-contain rounded-lg" />
                ) : (
                  job?.company.substring(0, 2)
                )}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{job?.title}</h1>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base md:text-lg text-muted-foreground">{job?.company}</span>
                  {job?.featured && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button onClick={handleSaveJob} variant={isSaved ? "secondary" : "outline"} size="sm" className="h-9">
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save Job"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                      <Linkedin className="mr-2 h-4 w-4" />
                      <span>LinkedIn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')}>
                      <Twitter className="mr-2 h-4 w-4" />
                      <span>Twitter</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('facebook')}>
                      <Facebook className="mr-2 h-4 w-4" />
                      <span>Facebook</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('email')}>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>WhatsApp</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')}>
                      <Link2 className="mr-2 h-4 w-4" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={handleApply} size="sm" className="h-9">
                Apply Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 border-t pt-4 md:pt-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-sm">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-xs text-muted-foreground">Job Type</p>
                <p className="font-medium text-sm">{job.type}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="font-medium text-sm">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-xs text-muted-foreground">Industry</p>
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20 mt-1 text-xs"
                  onClick={navigateToIndustryJobs}
                >
                  {job.industry}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <p className="text-foreground/90 mb-5 text-sm md:text-base">{job.description}</p>
              
              <h3 className="text-lg font-medium mt-5 mb-2">Requirements</h3>
              <ul className="space-y-1.5">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm md:text-base">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">About {job.company}</h2>
              <p className="text-foreground/90 text-sm md:text-base">
                {job.company} is a leading company in its field, committed to innovation and growth.
                We offer competitive benefits, a collaborative work environment, and opportunities for
                professional development. Join our team and be part of our mission to transform the industry.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Job Overview</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Posted</p>
                    <p className="text-sm">{job.postedAt}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Employment Type</p>
                    <p className="text-sm">{job.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary Range</p>
                    <p className="text-sm">{job.salary}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="text-sm">{job.industry}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleApply} className="w-full mb-2 h-9">
                  Apply for this position
                </Button>
                <Button variant="outline" onClick={handleTailorResume} className="w-full h-9">
                  Tailor Resume for This Job
                </Button>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3">
                Our career advisors can help you with your application and prepare for interviews.
              </p>
              <Button variant="outline" size="sm" className="w-full h-8">
                Get Career Advice
              </Button>
            </div>
          </div>
        </div>
      </div>
      {job && (
        () => {
          // Map Job to JobPosting structure
          const jobPostingData: JobPosting = {
            // id: job.id, // Removed as it's not in JobPosting type
            title: job.title,
            company: job.company,
            location: job.location, // Assuming JobPosting has location
            description: job.description, // Assuming JobPosting has description
            requiredSkills: job.requirements, // Map requirements to skills
            industries: [job.industry], // Map single industry to array
            requiredYearsOfExperience: 1, // Default value as Job type doesn't have it
            // Add other fields if needed, potentially with default values
            employmentType: job.type, // Assuming mapping
            salaryRange: job.salary, // Assuming mapping
          };
          return <TailorResumeModal jobPosting={jobPostingData} isOpen={tailorModalOpen} onClose={() => setTailorModalOpen(false)} />;
        }
      )()}
    </Layout>
  );
};

export default JobDetail;
