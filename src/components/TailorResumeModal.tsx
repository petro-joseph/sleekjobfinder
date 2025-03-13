
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Job } from '@/data/jobs';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface TailorResumeModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

const TailorResumeModal = ({ job, isOpen, onClose }: TailorResumeModalProps) => {
  const { user } = useAuthStore();
  const [selectedResumeId, setSelectedResumeId] = useState(user?.resumes[0]?.id || '');
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume to tailor");
      return;
    }

    setOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
      toast.success("Resume tailored successfully");
    }, 2000);
  };

  const handleDownload = () => {
    toast.success("Tailored resume downloaded");
    onClose();
  };

  const selectedResume = user?.resumes.find(r => r.id === selectedResumeId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tailor Resume for {job.title}</DialogTitle>
          <DialogDescription>
            Customize your resume to highlight skills and experience relevant to this job
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {!optimized ? (
              <motion.div
                key="tailoring"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Select Resume</Label>
                    <Select
                      value={selectedResumeId}
                      onValueChange={setSelectedResumeId}
                      disabled={optimizing}
                    >
                      <SelectTrigger id="resume">
                        <SelectValue placeholder="Select a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {user?.resumes.map(resume => (
                          <SelectItem key={resume.id} value={resume.id}>
                            {resume.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Optimization Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="keywords" defaultChecked className="mt-1" />
                        <div>
                          <Label htmlFor="keywords" className="font-medium">Keywords Optimization</Label>
                          <p className="text-sm text-muted-foreground">
                            Match keywords from the job description
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="skills" defaultChecked className="mt-1" />
                        <div>
                          <Label htmlFor="skills" className="font-medium">Skills Prioritization</Label>
                          <p className="text-sm text-muted-foreground">
                            Highlight skills relevant to {job.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="achievements" defaultChecked className="mt-1" />
                        <div>
                          <Label htmlFor="achievements" className="font-medium">Achievement Focus</Label>
                          <p className="text-sm text-muted-foreground">
                            Emphasize achievements that match job requirements
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-primary" />
                      Job Keywords Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 3).map((req, i) => {
                        // Extract first word from each requirement
                        const keyword = req.split(' ')[0];
                        return (
                          <span key={i} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            {keyword}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="optimized"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 text-center"
              >
                <div className="bg-green-500/10 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Resume Tailored Successfully!</h3>
                <p className="text-muted-foreground mb-6">
                  Your resume "{selectedResume?.name}" has been optimized for "{job.title}" at {job.company}.
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 mb-4 text-left">
                  <h4 className="font-medium mb-2">Improvements:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Added {job.requirements.length} keywords from job description</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Reordered skills to match job requirements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Highlighted relevant achievements</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {optimizing && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="loader mb-4" />
              <p className="text-center text-muted-foreground">
                Tailoring your resume for {job.title}...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {!optimized ? (
            <>
              <Button variant="outline" onClick={onClose} disabled={optimizing}>
                Cancel
              </Button>
              <Button onClick={handleOptimize} disabled={!selectedResumeId || optimizing}>
                {optimizing ? (
                  <>
                    <div className="loader mr-2" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Tailor Resume
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleDownload}>
                <FileText className="mr-2 h-4 w-4" />
                Download Tailored Resume
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TailorResumeModal;
