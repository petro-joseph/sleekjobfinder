
import React from 'react';
import { Card } from '../../ui/card';
import { WorkExperience } from '@/types/resume';

interface ExperienceCardProps {
  experience: WorkExperience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="font-medium">{experience.title} at {experience.company}</div>
        <div className="text-sm text-muted-foreground">{experience.startDate} - {experience.endDate || 'Present'}</div>
        <div className="text-sm">{experience.location}</div>
        <div>
          <div className="font-medium mt-2">Responsibilities:</div>
          <ul className="list-disc pl-5 mt-1">
            {experience.responsibilities.map((resp, rIndex) => (
              <li key={rIndex} className="text-sm">{resp}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
