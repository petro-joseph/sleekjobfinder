
import React from 'react';
import { Resume } from '@/types/resume';

interface ResumeHeaderProps {
  resume: Resume;
  template: string;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ resume, template }) => {
  return (
    <div className={`${template === 'compact' ? 'space-y-1' : 'space-y-3'}`}>
      <h1 className="text-2xl font-bold text-center">{resume.name}</h1>
      <div className="text-sm text-center text-muted-foreground">
        {[resume.contactInfo.phone, resume.contactInfo.email, resume.contactInfo.linkedin]
          .filter(Boolean)
          .join(' | ')}
      </div>
    </div>
  );
};

export default ResumeHeader;
