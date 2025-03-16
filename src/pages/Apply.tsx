
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jobs, Job } from '@/data/jobs';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { ChevronLeft, Upload, Download, FileText, PenTool, Info, CheckCircle, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import the missing Sparkles icon
import { Sparkles } from 'lucide-react';

const Apply = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [resumeKeywords, setResumeKeywords] = useState<string[]>([]);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
      return;
    }

    // Simulate API call to get job details
    const timer = setTimeout(() => {
      const foundJob = jobs.find(j => j.id === id);
      setJob(foundJob || null);
      setIsLoading(false);
      
      // Set default resume if user has any
      if (user?.resumes && user.resumes.length > 0) {
        setSelectedResume(user.resumes[0].id);
      }
      
      // Generate some placeholder keywords for resume optimization
      if (foundJob) {
        setResumeKeywords([
          'Experience with ' + foundJob.tags[0],
          foundJob.tags[1] + ' expertise',
          'Knowledge of ' + foundJob.industry,
          'Proficiency in ' + foundJob.tags[2],
          foundJob.title.split(' ')[0] + ' skills'
        ]);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [id, isAuthenticated, navigate, user]);

  const generateCoverLetter = () => {
    setIsGeneratingCoverLetter(true);
    
    // Simulate AI generating a cover letter
    setTimeout(() => {
      if (job) {
        const generated = 
`Dear Hiring Manager,

I am writing to express my interest in the ${job.title} position at ${job.company}, as advertised on SleekJobs. With my background in ${job.tags[0]} and experience with ${job.tags[1]}, I believe I am well-qualified for this role.

Throughout my career, I have developed strong skills in ${job.industry} and have consistently demonstrated my ability to deliver results. My experience aligns perfectly with the requirements outlined in your job description, particularly in the areas of ${job.tags.join(', ')}.

What attracts me to ${job.company} is your reputation for innovation and commitment to excellence in the ${job.industry} sector. I am particularly impressed by your company's recent achievements and would be excited to contribute to your continued success.

I am confident that my skills and experience make me an ideal candidate for this position. I would welcome the opportunity to discuss how my background and skills would benefit ${job.company}.

Thank you for considering my application. I look forward to the possibility of working with your team.

Sincerely,
${user?.firstName} ${user?.lastName}`;

        setGeneratedCoverLetter(generated);
        setCoverLetter(generated);
        setIsGeneratingCoverLetter(false);
        
        // Simulate AI suggestions
        setAiSuggestions([
          `Mention your specific achievements related to ${job.tags[0]}`,
          `Add details about your experience with ${job.tags[1]}`,
          `Highlight your educational background in ${job.industry}`,
          `Consider mentioning your certifications relevant to this role`
        ]);
        
        toast.success("Cover letter generated successfully");
      }
    }, 2000);
  };

  const handleSubmitApplication = () => {
    if (!selectedResume) {
      toast.error("Please select a resume before submitting your application");
      return;
    }
    
    // Simulate submitting application
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Application submitted successfully!", {
        description: "The employer will review your application and contact you if interested"
      });
      navigate('/progress');
    }, 1500);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loader mb-4" />
            <p className="text-muted-foreground">Loading application form...</p>
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
              The job you're trying to apply for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/jobs')}>
              Browse Jobs
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
          <Button variant="ghost" className="group" size="sm" onClick={() => navigate(`/jobs/${id}`)}>
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Job Details
          </Button>
        </div>

        {/* Job application header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Apply for {job.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <span className="mr-2">{job.company}</span>
            <span className="mx-2">•</span>
            <span>{job.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resume">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Resume</CardTitle>
                    <CardDescription>
                      Choose or upload a resume that best matches this job
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user?.resumes && user.resumes.length > 0 ? (
                      <div className="space-y-6">
                        <div className="grid gap-3">
                          <Label htmlFor="resume">Your Resumes</Label>
                          <Select 
                            value={selectedResume} 
                            onValueChange={setSelectedResume}
                          >
                            <SelectTrigger>
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
                        
                        <div className="flex items-center gap-2">
                          <Button className="w-full" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Preview Resume
                          </Button>
                          <Button className="w-full">
                            <Edit className="mr-2 h-4 w-4" />
                            Tailor for this Job
                          </Button>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">AI Resume Suggestions</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Based on this job description, we recommend highlighting these keywords in your resume:
                          </p>
                          <div className="space-y-2">
                            {resumeKeywords.map((keyword, index) => (
                              <div key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                <span className="text-sm">{keyword}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Resume Available</h3>
                        <p className="text-muted-foreground mb-6">
                          You don't have any resumes yet. Upload one or create a new resume.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Resume
                          </Button>
                          <Button onClick={() => navigate('/resume-builder')}>
                            Create New Resume
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cover-letter">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                    <CardDescription>
                      Create a personalized cover letter for this job application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {!generatedCoverLetter ? (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center py-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setCoverLetter("Dear Hiring Manager,\n\nI am writing to express my interest in the position...")}
                          >
                            <PenTool className="mr-2 h-4 w-4" />
                            Write My Own
                          </Button>
                          <Button 
                            onClick={generateCoverLetter}
                            disabled={isGeneratingCoverLetter}
                          >
                            {isGeneratingCoverLetter ? (
                              <>Generating...</>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate with AI
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Your Cover Letter</h3>
                            <Button variant="outline" size="sm" onClick={generateCoverLetter}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Regenerate
                            </Button>
                          </div>
                          
                          <Textarea
                            className="min-h-[300px] font-mono"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          />
                          
                          {aiSuggestions.length > 0 && (
                            <div className="mt-4 bg-secondary/30 p-4 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Info className="h-4 w-4 mr-2 text-primary" />
                                <span className="font-medium">AI Suggestions</span>
                              </div>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {aiSuggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <Button onClick={handleSubmitApplication} size="lg" className="w-full md:w-auto">
                Submit Application
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Company</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Employment Type</h3>
                    <p className="text-sm text-muted-foreground">{job.type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Salary Range</h3>
                    <p className="text-sm text-muted-foreground">{job.salary}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Key Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {job.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <p className="text-sm">Tailor your resume to highlight relevant experience</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <p className="text-sm">Include specific achievements with measurable results</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <p className="text-sm">Address requirements from the job description</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <p className="text-sm">Proofread for spelling and grammatical errors</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <p className="text-sm">Research the company before submitting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Apply;
