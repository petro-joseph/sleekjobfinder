import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Job } from "@/data/jobs";
import Layout from "@/components/Layout";
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
import { Input } from '@/components/ui/input';
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
import ApplyConfirmationModal from '../components/ApplyConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import { fetchJobById } from '@/api/jobs';
import { uploadResumeFile } from '@/integrations/supabase/uploadResume';
import { supabase } from '@/integrations/supabase/client';

const Apply = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuthStore();

  const [selectedTab, setSelectedTab] = useState("resume");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Track uploaded PDF for Supabase upload

  // Fetch job data from Supabase
  const { 
    data: job, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id || ''),
    enabled: !!id
  });

  // Update file upload handler to store uploaded file in state for eventual Supabase upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit exceeded", {
        description: "Please upload a file smaller than 5MB"
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file"
      });
      return;
    }

    setUploadedFile(file);

    // Simulate parsing and storing resume in user state for UI, but also keep file for real upload
    setTimeout(() => {
      const newResume = {
        id: Date.now().toString(),
        name: file.name,
        filePath: URL.createObjectURL(file),
        isPrimary: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (user) {
        const updatedResumes = [...(user.resumes || []), newResume];
        updateUser({
          ...user,
          resumes: updatedResumes
        });
      }

      toast.success("Resume uploaded successfully");
    }, 1500);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs", {
        description: "You've been redirected to the login page"
      });
      navigate('/login');
      return;
    }

    if (user?.resumes?.length > 0) {
      setSelectedResumeId(user.resumes[0].id);
    }
  }, [isAuthenticated, navigate, user]);

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

  const handleApplyClick = () => {
    if (job?.url) {
      window.open(job.url, '_blank');
      setTimeout(() => {
        setShowConfirmationModal(true);
      }, 1000);
    } else {
      handleSubmitApplication();
    }
  };

  const handleConfirmApplication = () => {
    setShowConfirmationModal(false);
    setIsSuccess(true);
    if (job) {
      const newApplication = {
        id: Date.now().toString(),
        jobId: job.id,
        position: job.title,
        company: job.company,
        status: "applied" as "applied",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        appliedAt: new Date().toISOString(),
      };
      if (user) {
        const updatedApplications = [...(user.applications || []), newApplication];
        updateUser({
          ...user,
          applications: updatedApplications,
        });
      }
    }
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
      localStorage.setItem("applicationSubmitted", "true");
      toast.success("Application submitted successfully!", {
        duration: 5000,
      });
    }, 1500);
  };

  useEffect(() => {
    if (localStorage.getItem("applicationSubmitted") === "true" && job) {
      localStorage.removeItem("applicationSubmitted");
      toast.success("Did you apply for this job?", {
        duration: 10000,
        action: {
          label: "Yes",
          onClick: () => {
            setHasApplied(true);
            const newApplication = {
              id: Date.now().toString(),
              jobId: job.id,
              position: job.title,
              company: job.company,
              status: "applied" as "applied",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              appliedAt: new Date().toISOString(),
            };
            if (user) {
              const updatedApplications = [...(user.applications || []), newApplication];
              updateUser({
                ...user,
                applications: updatedApplications,
              });
            }
          },
        },
      });
    }
  }, [job, updateUser, user]);

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

  if (error || !job) {
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

  if (hasApplied || isSuccess) {
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

  // --- NEW: Supabase Insert Resume ---
  async function saveResumeToSupabase(): Promise<string | null> {
    if (!uploadedFile || !user?.id) return null;

    // Upload file to bucket
    try {
      const filePath = await uploadResumeFile(uploadedFile, user.id);
      // Insert resume record
      const { data, error } = await supabase.from("resumes").insert({
        user_id: user.id,
        name: uploadedFile.name,
        file_path: filePath,
        is_primary: false,
      }).select().maybeSingle();

      if (error) throw error;
      return data?.file_path ?? null;
    } catch (err) {
      toast.error("Failed to upload resume to Supabase.");
      return null;
    }
  }

  // --- Override handleConfirmApplication ---
  const handleConfirmApplication = async () => {
    setShowConfirmationModal(false);
    setIsSuccess(true);

    let file_path: string | null = null;
    if (uploadedFile) {
      file_path = await saveResumeToSupabase();
    }

    if (job && user) {
      // Insert into applications table in Supabase
      const { error } = await supabase.from("applications").insert({
        job_id: job.id,
        user_id: user.id,
        position: job.title,
        company: job.company,
        status: "applied",
        applied_at: new Date().toISOString(),
      });

      if (error) {
        toast.error(`Error saving application to Supabase: ${error.message}`);
      } else {
        toast.success("Your application was saved!");
      }
    }

    // (Optional) You could also link to the Supabase resume via user's local state if needed
  };

  // --- NEW: Ask to save job if user didn't apply ---
  // Replace ApplyConfirmationModal usage with logic to prompt for saving job if answer is 'No'
  const [saveJobPrompt, setSaveJobPrompt] = useState(false);

  // Called when user chooses "No, not yet" in the confirmation modal
  const handleNotAppliedYet = () => {
    setShowConfirmationModal(false);
    setSaveJobPrompt(true);
  };

  // Handle saving job to Supabase's saved_jobs
  const handleSaveJobForLater = async () => {
    if (user && job) {
      const { error } = await supabase.from("saved_jobs").insert({
        job_id: job.id,
        user_id: user.id,
      });
      if (error) {
        toast.error("Failed to save job. Try again!");
        return;
      }
      toast.success("Job saved for later!");
      setSaveJobPrompt(false);
      // Redirect to saved jobs page
      navigate("/saved-jobs");
    }
  };

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
                        <Button variant="default" onClick={() => setTailorModalOpen(true)} className="w-full h-10 ">
                          Tailor Resume
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium mb-2">No Resumes Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't uploaded any resumes yet. Upload one to apply for this job.
                      </p>

                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Input
                          type="file"
                          accept=".pdf"
                          id="resume-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Label
                          htmlFor="resume-upload"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Click to upload your resume (PDF only)
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Maximum 5MB
                          </span>
                        </Label>
                      </div>
                      <div className="text-sm text-muted-foreground my-4">
                        <p>You don't have a resume? <br /> Use our resume builder to create a professional Resume</p>
                      </div>
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
              onClick={handleApplyClick}
              disabled={isSubmitting || (!selectedResumeId && !coverLetter)}
            >
              {isSubmitting ? (
                <>
                  <div className="loader mr-2" />
                  Applying...
                </>
              ) : (
                <>
                  Apply now
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {job && (
        <>
          <TailorResumeModal
            job={job}
            isOpen={tailorModalOpen}
            onClose={() => setTailorModalOpen(false)}
          />
          {/* Confirmation modal, updated */}
          <ApplyConfirmationModal
            isOpen={showConfirmationModal}
            onClose={handleNotAppliedYet} // Now handles "No, not yet"
            onConfirm={handleConfirmApplication}
            jobTitle={job.title}
            company={job.company}
          />
          {/* Save Job Prompt */}
          {saveJobPrompt && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg space-y-4 max-w-sm">
                <p>Would you like to save this job so you can apply later?</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSaveJobPrompt(false)}>
                    No, thanks
                  </Button>
                  <Button onClick={handleSaveJobForLater}>
                    Save Job
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Apply;
