
import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { JobPosting } from '@/types/resume';
import { defaultJobPosting } from '@/data/resume-data';

interface ResumeTailoringFlowProps {
  jobPosting?: JobPosting;
  onClose: () => void;
}

export const ResumeTailoringFlow: React.FC<ResumeTailoringFlowProps> = ({ 
  jobPosting = defaultJobPosting, 
  onClose 
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Tailor Your Resume</h2>
        <p className="mb-4">This feature will be available soon. You can tailor your resume to match the job posting requirements.</p>
        <Button onClick={onClose} variant="outline">
          Back to Options
        </Button>
      </Card>
    </div>
  );
};
