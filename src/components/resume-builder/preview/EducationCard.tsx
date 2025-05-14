
import React from 'react';
import { Education } from '@/types/resume';

interface EducationCardProps {
  education: Education;
  className?: string;
  compact?: boolean;
}

const EducationCard: React.FC<EducationCardProps> = ({ 
  education, 
  className = '',
  compact = false 
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{education.degree}</h3>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {education.startDate} - {education.endDate || 'Present'}
        </span>
      </div>
      <p className="text-sm">
        {education.institution}
        {education.gpa && <span> - GPA: {education.gpa}</span>}
      </p>
    </div>
  );
};

export default EducationCard;
