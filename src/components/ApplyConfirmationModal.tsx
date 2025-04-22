// components/ApplyConfirmationModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ApplyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  company: string;
  isConfirming?: boolean;
}

const ApplyConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  company,
}: ApplyConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Did you apply for this job?</DialogTitle>
          <DialogDescription>
            Did you complete your application for {jobTitle} at {company}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No, not yet
          </Button>
          <Button onClick={onConfirm}>
            Yes, I applied
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyConfirmationModal;