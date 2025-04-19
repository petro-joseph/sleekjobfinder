import { Dialog, DialogContent } from '@/components/ui/dialog';
import { JobPosting } from '@/types/resume'; // Assuming JobPosting type is here
import { ResumeTailoringFlow } from './resume-builder/ResumeTailoringFlow'; // Import the new flow component

interface TailorResumeModalProps {
  jobPosting: JobPosting; // Use JobPosting type
  isOpen: boolean;
  onClose: () => void;
}

const TailorResumeModal = ({ jobPosting, isOpen, onClose }: TailorResumeModalProps) => {
  // Removed old state and handlers

  return (
    // Restore onOpenChange for default close button, keep modal={true}
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      {/* Adjust DialogContent for size and layout */}
      <DialogContent className="max-w-none w-[90vw] h-[90vh] p-0 flex flex-col">
        {/*
          Removed DialogHeader, DialogTitle, DialogDescription, DialogFooter.
          The ResumeTailoringFlow component now manages its own header and content structure.
        */}
        {/* Render the tailoring flow, passing necessary props */}
        <ResumeTailoringFlow
            jobPosting={jobPosting}
            onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TailorResumeModal;
