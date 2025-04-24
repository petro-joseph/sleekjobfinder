import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Job } from "@/types";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, MapPin, ChevronLeft, FileText, Sparkles, Upload, CheckCircle, PenTool, Send, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TailorResumeModal from '@/components/TailorResumeModal';
import ApplyConfirmationModal from '../components/ApplyConfirmationModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobById } from '@/api/jobs';
import { uploadResumeFile } from '@/integrations/supabase/uploadResume';
import { supabase } from '@/integrations/supabase/client';
import { Resume, Application } from "@/types";

// Define a type for the application object stored in Supabase
interface ApplicationRecord {
  id?: string;
  job_id: string;
  user_id: string;
  position: string;
  company: string;
  status: 'applied';
  applied_at?: string;
  created_at?: string;
  updated_at?: string;
}

const Apply = () => {
  // Extract job ID from URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // States for managing UI and data
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [tailoredResumeContent, setTailoredResumeContent] = useState<string | null>(null);
  const [isApplyButtonLoading, setIsApplyButtonLoading] = useState(false);

  // Access user and resumes from Zustand store
  const user = useAuthStore((state) => state.user);
  const resumes = useAuthStore((state) => state.resumes);
  const userId = user?.id;

  // Fetch job details using react-query
  const { data: job, isLoading: isJobLoading, isError: isJobError } = useQuery(
    ['job', id],
    () => fetchJobById(id!),
    {
      enabled: !!id, // Ensure job ID is available before fetching
      retry: false, // Disable retries
    }
  );

  // Mutation for submitting the application
  const submitApplicationMutation = useMutation(
    async (applicationData: ApplicationRecord) => {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData]);

      if (error) {
        console.error('Error submitting application:', error);
        throw new Error(`Failed to submit application: ${error.message}`);
      }

      return data;
    },
    {
      onSuccess: () => {
        // Invalidate queries to update the cache
        queryClient.invalidateQueries(['applications', userId]);
        queryClient.invalidateQueries(['user']);

        // Show success message
        toast.success('Application submitted successfully!');
        setIsConfirmationModalOpen(false);
        navigate('/progress');
      },
      onError: (error: any) => {
        toast.error(`Failed to submit application: ${error.message}`);
      },
      onSettled: () => {
        setIsApplyButtonLoading(false); // Stop loading regardless of success or failure
      },
    }
  );

  // Check if the user has already applied for the job
  const { data: existingApplication, isLoading: isExistingApplicationLoading } = useQuery(
    ['applications', userId, id],
    async () => {
      if (!userId || !id) return null;

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .eq('job_id', id)
        .single();

      if (error) {
        console.error('Error fetching existing application:', error);
        return null;
      }

      return data;
    },
    {
      enabled: !!userId && !!id, // Only run the query if userId and id are available
    }
  );

  // Handler for submitting the application
  const handleSubmit = async () => {
    if (!job || !user) {
      toast.error('Job or user data not available.');
      return;
    }

    if (!selectedResume && !resumeFile) {
      toast.error('Please select a resume or upload a new one.');
      return;
    }

    setIsApplyButtonLoading(true); // Start loading

    try {
      const applicationData: ApplicationRecord = {
        job_id: job.id,
        user_id: user.id,
        position: job.title,
        company: job.company,
        status: 'applied',
      };

      await submitApplicationMutation.mutateAsync(applicationData);
    } catch (error: any) {
      toast.error(`Failed to submit application: ${error.message}`);
      setIsApplyButtonLoading(false); // Stop loading on error
    }
  };

  // Handler for uploading a new resume
  const handleResumeUpload = async (file: File) => {
    setUploading(true);
    try {
      const filePath = await uploadResumeFile(file, userId!);
      setResumeFile(file);

      // Optimistically update the resumes in the Zustand store
      useAuthStore.setState((state) => ({
        resumes: [
          ...state.resumes,
          {
            id: 'temp_' + Date.now(), // Temporary ID
            name: file.name,
            file_path: filePath,
            isPrimary: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            uploadDate: new Date(),
            user_id: userId,
          },
        ],
      }));

      toast.success('Resume uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast.error(`Failed to upload resume: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handler to open the tailor resume modal
  const handleTailorResume = () => {
    if (!job) {
      toast.error('Job details not loaded yet.');
      return;
    }
    setIsTailorModalOpen(true);
  };

  // Handler to close the tailor resume modal
  const handleTailorModalClose = () => {
    setIsTailorModalOpen(false);
  };

  // Handler to confirm application submission
  const handleConfirmApply = () => {
    setIsConfirmationModalOpen(true);
  };

  // Handler to cancel application submission
  const handleCancelApply = () => {
    setIsConfirmationModalOpen(false);
  };

  // Memoized list of resume options for the select component
  const resumeOptions = useMemo(
    () =>
      resumes
        ? resumes.map((resume) => ({
          value: resume.id,
          label: resume.name,
        }))
        : [],
    [resumes]
  );

  // Check if the component is still loading data
  const isLoading = isJobLoading || isExistingApplicationLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (isJobError || !job) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-500">Failed to load job details.</p>
            <Link to="/jobs" className="text-blue-500 mt-4">
              Back to Jobs
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (existingApplication) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Already Applied</h2>
            <p className="text-gray-500">You have already applied for this job.</p>
            <Link to="/progress" className="text-blue-500 mt-4">
              View Application Status
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <Link to={`/jobs/${job.id}`} className="inline-flex items-center mb-4 text-blue-500 hover:underline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Job Details
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
            <CardDescription>Apply for the {job.title} position at {job.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={job.title} readOnly />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={job.company} readOnly />
              </div>
              <div>
                <Label htmlFor="resume">Select Resume</Label>
                <Select onValueChange={setSelectedResume}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="upload">Upload New Resume</Label>
                <Input
                  type="file"
                  id="upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleResumeUpload(file);
                    }
                  }}
                />
                <Button asChild variant="outline" disabled={uploading}>
                  <Label htmlFor="upload" className="cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Resume
                      </>
                    )}
                  </Label>
                </Button>
                {resumeFile && (
                  <Badge variant="secondary" className="mt-2">
                    {resumeFile.name} <CheckCircle className="ml-2 h-4 w-4" />
                  </Badge>
                )}
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Write your cover letter here"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="secondary" onClick={handleTailorResume}>
              <PenTool className="mr-2 h-4 w-4" />
              Tailor Resume
            </Button>
            <Button onClick={handleConfirmApply} disabled={isApplyButtonLoading}>
              {isApplyButtonLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <TailorResumeModal
        job={job}
        isOpen={isTailorModalOpen}
        onClose={handleTailorModalClose}
      />

      <ApplyConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleSubmit}
        onCancel={handleCancelApply}
      />
    </Layout>
  );
};

export default Apply;
