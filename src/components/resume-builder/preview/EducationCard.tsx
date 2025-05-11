
import React from 'react';
import { Card } from '../../ui/card';
import { Education } from '@/types/resume';

interface EducationCardProps {
  education: Education;
}

export const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="font-medium">{education.degree} {education.field ? `in ${education.field}` : ''}</div>
        <div className="text-sm">{education.institution}</div>
        <div className="text-sm text-muted-foreground">{education.startDate} - {education.endDate}</div>
        {education.gpa && <div className="text-sm">GPA: {education.gpa}</div>}
      </div>
    </Card>
  );
};
