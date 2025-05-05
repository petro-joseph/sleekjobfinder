
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { JobPosting } from '@/types/resume';
import { ResumeTailoringFlow } from './resume-builder/ResumeTailoringFlow';
import { Job } from '@/data/jobs';
import { useState, useTransition } from 'react';

interface TailorResumeModalProps {
  job?: Job;
  jobPosting?: JobPosting;
  isOpen: boolean;
  onClose: () => void;
}

const TailorResumeModal = ({ job, jobPosting, isOpen, onClose }: TailorResumeModalProps) => {
  const [isPending, startTransition] = useTransition();
  
  // Convert Job to JobPosting if jobPosting is not provided but job is
  const effectiveJobPosting: JobPosting | undefined = jobPosting || (job ? {
    title: job.title,
    company: job.company,
    location: job.location,
    salaryRange: job.salary,
    employmentType: job.type,
    requiredYearsOfExperience: 1, // Default value
    industries: [job.industry], // Convert single industry to array
    requiredSkills: job.requirements, // Use requirements as skills
    description: job.description,
  } : undefined);
  
  const handleClose = () => {
    startTransition(() => {
      onClose();
    });
  };

  // Don't render if we don't have a jobPosting or couldn't create one from job
  if (!effectiveJobPosting) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent className="max-w-none w-[90vw] h-[90vh] p-0 flex flex-col">
        <DialogTitle className="sr-only">Tailor Resume for {effectiveJobPosting.company}</DialogTitle>
        <ResumeTailoringFlow
            jobPosting={effectiveJobPosting}
            onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TailorResumeModal;
