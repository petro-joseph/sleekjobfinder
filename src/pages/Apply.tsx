import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Job } from "@/data/jobs"; // Assuming this type definition is correct
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, MapPin, ChevronLeft, FileText, Sparkles, Upload, CheckCircle, PenTool, Send, Clock, Loader2 } from 'lucide-react'; // Added Loader2
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TailorResumeModal from '@/components/TailorResumeModal'; // Assuming path is correct
import ApplyConfirmationModal from '../components/ApplyConfirmationModal'; // Assuming path is correct
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobById } from '@/api/jobs'; // Assuming path is correct
import { uploadResumeFile } from '@/integrations/supabase/uploadResume'; // Assuming path is correct
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types/resume';

// Define a type for the application object stored in Zustand/Supabase
interface Application {
  id: string;
  job_id: string;
  user_id: string;
  position: string;
  company: string;
  status: 'applied';
  createdAt: string;
  updatedAt: string;
}

interface ApplicationRecord {
  id?: string; // Optional from DB before insert
  job_id: string;
  user_id: string;
  position: string;
  company: string;
  status: 'applied'; // Explicitly setting status
  applied_at?: string; // Optional, set during insert
  created_at?: string;
  updated_at?: string;
}

const Apply = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, updateUser } = useAuthStore();

  // State
  const [selectedTab, setSelectedTab] = useState("resume");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Controls the success screen
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSaveJobPrompt, setShowSaveJobPrompt] = useState(false);

  // --- Data Fetching ---
  const { data: job, isLoading: isJobLoading, error: jobError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId || ''),
    enabled: !!jobId && isAuthenticated, // Ensure user is authenticated before fetching
  });

  // --- Authentication Check ---
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs", {
        description: "Redirecting to login...",
      });
      navigate('/login', { state: { from: `/apply/${jobId}` } }); // Redirect with state
    }
  }, [isAuthenticated, navigate, jobId]);

  // --- Initialize selected resume ---
  useEffect(() => {
    if (user?.resumes && user.resumes.length > 0) {
      // Try to select the primary resume first, otherwise the first one
      const primaryResume = user.resumes.find(r => r.isPrimary);
      setSelectedResumeId(primaryResume?.id || user.resumes[0].id);
    } else {
      setSelectedResumeId(null); // Ensure it's null if no resumes
    }
  }, [user?.resumes]); // Depend only on resumes array


  // --- Mutations ---

  // 1. Upload Resume Mutation
  const uploadResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("User not authenticated");

      // 1. Upload to Storage
      const filePath = await uploadResumeFile(file, user.id); // This should return the storage path
      if (!filePath) throw new Error("File upload failed");

      // 2. Insert record into 'resumes' table
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          name: file.name,
          file_path: filePath,
          isPrimary: !(user.resumes && user.resumes.length > 0), // Make first upload primary
        })
        .select()
        .single(); // Expecting a single new record

      if (error) throw error;
      if (!data) throw new Error("Failed to save resume record");

      // Return the newly created resume record (adjust type as needed)
      return data as Resume;
    },

    onSuccess: (newResumeData: Resume) => {
      toast.success(`Resume "${newResumeData.name}" uploaded successfully!`);
      // Update Zustand store
      if (user) {

        const updatedResumes: Resume[] = [...(user.resumes || []), newResumeData];
        // If this was the first resume, make it primary in the store update
        if (updatedResumes.length === 1) {
          updatedResumes[0].isPrimary = true;
        }
        updateUser({ ...user, resumes: updatedResumes });
        setSelectedResumeId(newResumeData.id); // Select the newly uploaded resume
      }
      // Optionally invalidate queries if resumes are fetched separately
      // queryClient.invalidateQueries({ queryKey: ['userResumes', user?.id] });

    }, onError: (error: any) => {
      toast.error("Resume Upload Failed", { description: error.message });
    },
  });

  // 2. Create Application Mutation
  const createApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!job || !user?.id) throw new Error("Job data or user missing");

      const applicationData: ApplicationRecord = {
        job_id: job.id,
        user_id: user.id,
        position: job.title,
        company: job.company,
        status: "applied", // Default status when recording application
        // applied_at is set by default in Supabase or use new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("applications")
        .insert(applicationData)
        .select()
        .single();

      if (error) {
        // Handle potential duplicate entry (user already applied)
        if (error.code === '23505') { // Check Supabase docs for exact unique violation code
          toast.warning("Already Applied", { description: "You have already recorded an application for this job." });
          // Set success anyway to show the final screen, as the goal (recording) is met
          return { ...applicationData, id: 'existing' }; // Indicate existing application
        }
        throw error; // Rethrow other errors
      }
      if (!data) throw new Error("Failed to save application record");

      return data as ApplicationRecord; // Return the saved application data
    },
    onSuccess: (savedApplication) => {
      if (savedApplication.id !== 'existing') { // Only show success toast for new applications
        toast.success("Application Recorded!", { description: `Your application for ${job?.title} is saved.` });
      }
      // Update Zustand store (only if it's a new application)
      if (user && savedApplication.id !== 'existing') {
        const applicationForStore = {
          ...savedApplication,
          id: savedApplication.id || '', // Ensure id is present and non-null
          createdAt: savedApplication.created_at || new Date().toISOString(),
          updatedAt: savedApplication.updated_at || new Date().toISOString()
        } as Application; // Assert as Application type
        const updatedApplications = [...(user.applications || []), applicationForStore];
        updateUser({ ...user, applications: updatedApplications });
      }
      // Invalidate queries related to applications
      queryClient.invalidateQueries({ queryKey: ['applications', user?.id] });
      setIsSuccess(true); // Show the success screen
    },
    onError: (error: any) => {
      toast.error("Failed to Record Application", { description: error.message });
      setShowConfirmationModal(false); // Close modal on error
    },
  });

  // 3. Save Job Mutation
  const saveJobMutation = useMutation({
    mutationFn: async () => {
      if (!job || !user?.id) throw new Error("Job data or user missing");

      console.log("Saving job:", job, user.id);
      // Insert into 'saved_jobs' table
      const { data, error } = await supabase
        .from("saved_jobs")
        .insert({
          job_id: job.id,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        // Handle potential duplicate entry (job already saved)
        if (error.code === '23505') {
          toast.info("Job Already Saved", { description: "This job is already in your saved list." });
          return { job_id: job.id, user_id: user.id, id: 'existing' }; // Indicate existing saved job
        }
        throw error; // Rethrow other errors
      }
      if (!data) throw new Error("Failed to save job record");

      // Return job data for Zustand update (or refine as needed)
      return { ...job, id: data.id }; // Use the DB id if needed
    },
    onSuccess: (savedJobData) => {
      if (savedJobData.id !== 'existing') { // Only show success for newly saved jobs
        toast.success("Job Saved!", { description: `${job?.title} saved for later.` });
        // Update Zustand Store
        if (user && job) {
          // Assuming user.savedJobs stores Job objects
          const updatedSavedJobs = [...(user.savedJobs || []), job];
          updateUser({ ...user, savedJobs: updatedSavedJobs });
        }
      }
      // Invalidate queries related to saved jobs
      queryClient.invalidateQueries({ queryKey: ['savedJobs', user?.id] });
      setShowSaveJobPrompt(false); // Close the prompt
      navigate('/progress?tab=saved'); // Navigate to saved jobs tab in progress page (example)
    },
    onError: (error: any) => {
      toast.error("Failed to Save Job", { description: error.message });
      setShowSaveJobPrompt(false); // Close the prompt on error
    },
  });


  // --- Event Handlers ---

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow re-uploading the same file name
    e.target.value = '';

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit exceeded (Max 5MB)");
      return;
    }
    if (file.type !== 'application/pdf') {
      toast.error("Invalid file type (PDF only)");
      return;
    }

    uploadResumeMutation.mutate(file); // Trigger the mutation

  }, [uploadResumeMutation]);

  const generateCoverLetter = useCallback(() => {
    if (!job || !user) return;
    setIsGeneratingCoverLetter(true);
    // Replace setTimeout with actual API call if available
    setTimeout(() => {
      const generatedLetter = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in ${job.industry || '[Your Industry]'} and expertise in ${job.requirements?.[0]?.split(' ')[0] || '[Key Skill]'}, I believe I am well-positioned to contribute significantly.\n\n[Briefly mention 1-2 relevant experiences or accomplishments related to the job description: ${job.description?.substring(0, 50)}...]\n\nMy key skills include:\n• ${job.requirements?.[0] || '[Skill 1]'}\n• ${job.requirements?.[1] || '[Skill 2]'}\n• ${job.requirements?.[2] || 'Problem-solving'}\n\nI am impressed by ${job.company}'s work in ${job.industry || '[Company Field]'} and am eager to bring my skills to your team.\n\nThank you for considering my application.\n\nSincerely,\n${user.firstName || ''} ${user.lastName || ''}`;
      setCoverLetter(generatedLetter);
      setIsGeneratingCoverLetter(false);
      toast.success("Cover letter generated!");
    }, 1500);
  }, [job, user]);


  const handleApplyClick = useCallback(() => {
    // Basic validation before proceeding
    if (!selectedResumeId && selectedTab === 'resume' && user?.resumes?.length > 0) {
      toast.error("Please select a resume");
      return;
    }
    if (!coverLetter && selectedTab === 'cover-letter') {
      // Optional: Warn if cover letter is empty but not strictly required
      // toast.warning("Cover letter is empty", { description: "Consider adding a cover letter." });
    }

    if (job?.url) {
      // External Application Flow
      window.open(job.url, '_blank', 'noopener,noreferrer'); // Open external link
      // Show confirmation modal after a short delay to allow tab switch
      setTimeout(() => {
        setShowConfirmationModal(true);
      }, 1500);
    } else {
      // Internal Application Flow (or no URL provided)
      createApplicationMutation.mutate();
    }
  }, [job, createApplicationMutation, selectedResumeId, coverLetter, selectedTab, user?.resumes]);

  // Handler when user confirms they *did* apply externally
  const handleConfirmApplication = useCallback(() => {
    setShowConfirmationModal(false);
    createApplicationMutation.mutate(); // Record the application
  }, [createApplicationMutation]);

  // Handler when user says they did *not* apply externally (or closes modal)
  const handleNotAppliedYet = useCallback(() => {
    setShowConfirmationModal(false);
    setShowSaveJobPrompt(true); // Ask if they want to save the job
  }, []);

  // Handler for saving the job after declining application confirmation
  const handleSaveJobForLater = useCallback(() => {
    saveJobMutation.mutate();
  }, [saveJobMutation]);


  // --- Computed Values ---
  const selectedResume = useMemo(() => {
    if (!user?.resumes || !selectedResumeId) return null;
    return user.resumes.find(resume => resume.id === selectedResumeId);
  }, [user?.resumes, selectedResumeId]);

  // --- Render Logic ---

  if (!isAuthenticated) {
    // Render minimal layout while redirecting or show loading
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </Layout>
    );
  }

  if (isJobLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </Layout>
    );
  }

  if (jobError || !job) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-destructive">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {jobError?.message || "The job you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild variant="secondary">
              <Link to="/jobs">Back to Jobs</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Success Screen
  if (isSuccess) {
    return (
      <Layout>
        {/* ... (Keep the existing success screen JSX) ... */}
        <div className="container mx-auto px-6 py-12 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Application Recorded!</h1>
            <p className="text-muted-foreground">
              Your application submission for <span className="font-medium text-foreground">{job.title}</span> at <span className="font-medium text-foreground">{job.company}</span> has been recorded.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>Typical next steps in the application process</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ... (Keep the existing "What's Next?" content) ... */}
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Application Review</h3>
                    <p className="text-sm text-muted-foreground">
                      The hiring team will review your application and profile.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Initial Contact</h3>
                    <p className="text-sm text-muted-foreground">
                      If shortlisted, they'll typically reach out via email or phone.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Interview Process</h3>
                    <p className="text-sm text-muted-foreground">
                      Prepare for potential interviews (phone, video, or in-person).
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

  // Main Apply Form Screen
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="group" size="sm">
            {/* Link back to job details page */}
            <Link to={`/jobs/${job.id}`}>
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Job Details
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for {job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1.5" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Badge variant="secondary">{job.type}</Badge>
              </div>
            </div>
          </div>

          {/* Tabs for Resume/Cover Letter */}
          <Tabs defaultValue="resume" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="resume">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="cover-letter">
                <PenTool className="mr-2 h-4 w-4" />
                Cover Letter (Optional)
              </TabsTrigger>
            </TabsList>

            {/* Resume Tab Content */}
            <TabsContent value="resume" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select or Upload Resume</CardTitle>
                  <CardDescription>
                    Choose an existing resume or upload a new one (PDF, max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.resumes && user.resumes.length > 0 ? (
                    <div className="space-y-4">
                      {/* Resume Selection Dropdown */}
                      <div className="space-y-2">
                        <Label htmlFor="resume-select">Your Resumes</Label>
                        <Select
                          value={selectedResumeId ?? ""} // Ensure value is not null/undefined
                          onValueChange={(value) => setSelectedResumeId(value || null)} // Handle empty selection
                          disabled={uploadResumeMutation.isPending}
                        >
                          <SelectTrigger id="resume-select">
                            <SelectValue placeholder="Select a resume..." />
                          </SelectTrigger>
                          <SelectContent>
                            {user.resumes.map(resume => (
                              <SelectItem key={resume.id} value={resume.id}>
                                {resume.name} {resume.isPrimary ? '(Primary)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Selected Resume Preview (Simplified) */}
                      {selectedResume && (
                        <div className="border rounded-lg p-4 flex justify-between items-center bg-muted/30">
                          <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-primary shrink-0" />
                            <div>
                              <p className="font-medium">{selectedResume.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Added: {selectedResume.created_at ? new Date(selectedResume.created_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          {/* Add preview/download functionality if needed */}
                          {/* <Button variant="outline" size="sm" onClick={() => window.open(selectedResume.file_path, '_blank')}>Preview</Button> */}
                        </div>
                      )}

                  

                      {/* AI Tailoring Section */}
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20 mt-4">
                        <div className="flex items-start mb-2">
                          <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                          <div>
                            <h3 className="font-medium">Tailor your resume?</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Optimize your selected resume specifically for this job using AI.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTailorModalOpen(true)}
                              disabled={!selectedResumeId || uploadResumeMutation.isPending}
                              className="bg-background hover:bg-muted"
                            >
                              <Sparkles className="mr-2 h-4 w-4" />
                              Tailor Selected Resume
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Initial Upload State (No Resumes Yet)
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium mb-2">No Resumes Found</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload your resume (PDF) to get started.
                      </p>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-4">
                        <Input
                          type="file"
                          accept=".pdf"
                          id="resume-upload-initial"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploadResumeMutation.isPending}
                        />
                        <Label
                          htmlFor="resume-upload-initial"
                          className={`flex flex-col items-center ${uploadResumeMutation.isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {uploadResumeMutation.isPending ? (
                            <Loader2 className="h-8 w-8 mb-2 animate-spin text-muted-foreground" />
                          ) : (
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">
                            {uploadResumeMutation.isPending ? 'Uploading...' : 'Click to upload resume (PDF)'}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">Maximum 5MB</span>
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground my-4">
                        Don't have a resume?
                      </p>
                      <Button asChild variant="secondary">
                        <Link to="/resume-builder">
                          Use Resume Builder
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cover Letter Tab Content */}
            <TabsContent value="cover-letter" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter (Optional)</CardTitle>
                  <CardDescription>
                    Write or generate a cover letter to introduce yourself.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* AI Generate Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateCoverLetter}
                        disabled={isGeneratingCoverLetter || createApplicationMutation.isPending}
                      >
                        {isGeneratingCoverLetter ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        {isGeneratingCoverLetter ? 'Generating...' : 'Generate with AI'}
                      </Button>
                    </div>
                    {/* Text Area */}
                    <Textarea
                      id="cover-letter"
                      placeholder="Write your cover letter here, or use the AI generator..."
                      className="min-h-[300px] focus-visible:ring-primary"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      disabled={createApplicationMutation.isPending}
                    />
                    {/* Tips Section */}
                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <h3 className="font-medium text-sm mb-2">Quick Tips:</h3>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Address the hiring manager if known.</li>
                        <li>• Briefly connect your skills to the job requirements.</li>
                        <li>• Express enthusiasm for the role and company.</li>
                        <li>• Keep it concise and proofread carefully.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t mt-8">
            <Button variant="outline" onClick={() => navigate(`/jobs/${job.id}`)} disabled={createApplicationMutation.isPending || saveJobMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyClick}
              disabled={
                // Disable if no resume selected/uploaded OR if any mutation is pending
                (!(user?.resumes && user.resumes.length > 0) && !selectedResumeId) ||
                createApplicationMutation.isPending ||
                saveJobMutation.isPending ||
                uploadResumeMutation.isPending
              }
              className="min-w-[120px]" // Ensure button width doesn't jump too much
            >
              {createApplicationMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {createApplicationMutation.isPending ? 'Submitting...' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {job && (
        <>
          <TailorResumeModal
            job={job}
            isOpen={tailorModalOpen}
            onClose={() => setTailorModalOpen(false)}
          // Pass selected resume data if needed by modal
          // selectedResume={selectedResume}
          />
          <ApplyConfirmationModal
            isOpen={showConfirmationModal && !createApplicationMutation.isPending} // Hide if submitting
            onClose={handleNotAppliedYet}
            onConfirm={handleConfirmApplication}
            jobTitle={job.title}
            company={job.company}
            // Pass mutation loading state to disable buttons in modal
            isConfirming={createApplicationMutation.isPending}
          />
          {/* Save Job Prompt Modal (Simplified) */}
          {showSaveJobPrompt && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Apply Later?</CardTitle>
                  <CardDescription>Save this job to apply when you're ready.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Do you want to save the <span className="font-medium">{job.title}</span> position at <span className="font-medium">{job.company}</span> to your saved jobs list?
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowSaveJobPrompt(false)} disabled={saveJobMutation.isPending}>
                    No, Thanks
                  </Button>
                  <Button onClick={handleSaveJobForLater} disabled={saveJobMutation.isPending}>
                    {saveJobMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Job
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Apply;