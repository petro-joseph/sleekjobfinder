
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { JobPosting } from '@/types/resume'; // Import JobPosting type
import { ResumeTailoringFlow } from './resume-builder/ResumeTailoringFlow'; // Import the flow component
import { Job } from '@/data/jobs'; // Import Job type

interface TailorResumeModalProps {
  job?: Job; // Add optional Job prop
  jobPosting?: JobPosting; // Make JobPosting optional
  isOpen: boolean;
  onClose: () => void;
}

const TailorResumeModal = ({ job, jobPosting, isOpen, onClose }: TailorResumeModalProps) => {
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
    description: job.description
  } : undefined);

  // Don't render if we don't have a jobPosting or couldn't create one from job
  if (!effectiveJobPosting) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-w-none w-[90vw] h-[90vh] p-0 flex flex-col">
        <DialogTitle className="sr-only">Tailor Resume for {effectiveJobPosting.company}</DialogTitle>
        <ResumeTailoringFlow
            jobPosting={effectiveJobPosting}
            onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TailorResumeModal;
