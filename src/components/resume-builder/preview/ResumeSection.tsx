
import React from 'react';
import { Card } from '../../ui/card';

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
