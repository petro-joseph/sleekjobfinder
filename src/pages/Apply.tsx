
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobs, Job } from '@/data/jobs';
import Layout from '@/components/Layout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Briefcase,
  Building,
  MapPin,
  ChevronLeft,
  FileText,
  Sparkles,
  Upload,
  CheckCircle,
  PenTool,
  Send,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TailorResumeModal from '@/components/TailorResumeModal';

const Apply = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("resume");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
      return;
    }
    
    const timer = setTimeout(() => {
      const foundJob = jobs.find(j => j.id === id);
      setJob(foundJob || null);
      
      if (user?.resumes?.length > 0) {
        setSelectedResumeId(user.resumes[0].id);
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id, isAuthenticated, navigate, user]);
  
  const generateCoverLetter = () => {
    if (!job) return;
    
    setIsGeneratingCoverLetter(true);
    
    // Simulate AI generating a cover letter
    setTimeout(() => {
      const generatedLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in ${job.industry} and expertise in ${job.requirements[0].split(' ')[0]}, I believe I am well-positioned to make valuable contributions to your team.

${job.description}

Throughout my career, I have developed strong skills in:
• ${job.requirements[0]}
• ${job.requirements[1]}
• ${job.requirements.length > 2 ? job.requirements[2] : 'Problem-solving and critical thinking'}

I am particularly drawn to ${job.company}'s reputation for innovation and excellence in the ${job.industry} industry. I am excited about the opportunity to bring my unique perspective and skills to your team.

Thank you for considering my application. I look forward to the possibility of discussing how my background and skills would be a good match for this position.

Sincerely,
${user?.firstName} ${user?.lastName}`;
      
      setCoverLetter(generatedLetter);
      setIsGeneratingCoverLetter(false);
    }, 2000);
  };
  
  const handleSubmitApplication = () => {
    if (!selectedResumeId && !coverLetter) {
      toast.error("Please select a resume or write a cover letter");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submitting application
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    }, 1500);
  };
  
  const getSelectedResume = () => {
    if (!user || !selectedResumeId) return null;
    return user.resumes.find(resume => resume.id === selectedResumeId);
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
  
  if (isSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground">
              Your application for <span className="font-medium text-foreground">{job.title}</span> at <span className="font-medium text-foreground">{job.company}</span> has been submitted successfully.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>Here's what you can expect from your application process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Application Review</h3>
                    <p className="text-sm text-muted-foreground">
                      The hiring team will review your application and resume
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Initial Contact</h3>
                    <p className="text-sm text-muted-foreground">
                      If your profile is a good match, they'll reach out via email or phone
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Interview Process</h3>
                    <p className="text-sm text-muted-foreground">
                      You may be invited for one or more interviews
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/progress">
                <Clock className="mr-2 h-4 w-4" />
                Track Application
              </Link>
            </Button>
            <Button asChild>
              <Link to="/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Browse More Jobs
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="group" size="sm">
            <Link to={`/jobs/${job.id}`}>
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Job Details
            </Link>
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for {job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Badge variant="outline">{job.type}</Badge>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="resume" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="resume">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="cover-letter">
                <PenTool className="mr-2 h-4 w-4" />
                Cover Letter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Resume</CardTitle>
                  <CardDescription>
                    Choose a resume to submit with your application or tailor a resume for this job
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.resumes && user.resumes.length > 0 ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="resume">Your Resumes</Label>
                        <Select
                          value={selectedResumeId}
                          onValueChange={setSelectedResumeId}
                        >
                          <SelectTrigger id="resume">
                            <SelectValue placeholder="Select a resume" />
                          </SelectTrigger>
                          <SelectContent>
                            {user.resumes.map(resume => (
                              <SelectItem key={resume.id} value={resume.id}>
                                {resume.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedResumeId && (
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-primary mr-3" />
                            <div>
                              <p className="font-medium">{getSelectedResume()?.name}</p>
                              <p className="text-sm text-muted-foreground">Last updated: {getSelectedResume()?.updatedAt}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                        </div>
                      )}
                      
                      <div className="bg-secondary/30 rounded-lg p-4">
                        <div className="flex items-start mb-2">
                          <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Tailor your resume</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Our AI can optimize your resume to match this job's requirements
                            </p>
                          </div>
                        </div>
                        <Button variant="secondary" onClick={() => setTailorModalOpen(true)}>
                          Tailor Resume
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Resumes Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't created any resumes yet. Create one to apply for this job.
                      </p>
                      <Button asChild>
                        <Link to="/resume-builder">
                          Create Resume
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cover-letter" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                  <CardDescription>
                    Write a cover letter or use our AI to generate one tailored to this job
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="cover-letter">Your Cover Letter</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateCoverLetter}
                          disabled={isGeneratingCoverLetter}
                        >
                          {isGeneratingCoverLetter ? (
                            <>
                              <div className="loader mr-2" /> 
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id="cover-letter"
                        placeholder="Write or generate a cover letter to introduce yourself and explain why you're a good fit for this role..."
                        className="min-h-[300px]"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>
                    
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Cover Letter Tips</h3>
                          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                            <li>• Address your letter to the hiring manager if possible</li>
                            <li>• Highlight relevant skills and experiences</li>
                            <li>• Explain why you're interested in this specific role and company</li>
                            <li>• Keep it concise, around 250-400 words</li>
                            <li>• Proofread carefully for errors</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center pt-6 border-t mt-8">
            <Button variant="outline" onClick={() => navigate(`/jobs/${job.id}`)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApplication}
              disabled={isSubmitting || (!selectedResumeId && !coverLetter)}
            >
              {isSubmitting ? (
                <>
                  <div className="loader mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {job && <TailorResumeModal job={job} isOpen={tailorModalOpen} onClose={() => setTailorModalOpen(false)} />}
    </Layout>
  );
};

export default Apply;
