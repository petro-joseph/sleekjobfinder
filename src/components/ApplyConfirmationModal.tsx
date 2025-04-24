
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
  onCancel: () => void; // Add this prop to match how it's used
  jobTitle?: string;
  company?: string;
  isConfirming?: boolean;
}

const ApplyConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  jobTitle,
  company,
}: ApplyConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Did you apply for this job?</DialogTitle>
          <DialogDescription>
            Did you complete your application for {jobTitle || "this position"} at {company || "this company"}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel || onClose}>
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
