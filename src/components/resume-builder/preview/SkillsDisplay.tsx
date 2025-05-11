
import React from 'react';
import { Card } from '../../ui/card';

interface SkillsDisplayProps {
  skills: string[];
}

export const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills }) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
};
