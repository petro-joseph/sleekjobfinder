
import React from 'react';
import { WorkExperience } from '@/types/resume';
import { safeToString, isValidArray } from '@/lib/utils';

interface ExperienceCardProps {
  experience: WorkExperience;
  className?: string;
  compact?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ 
  experience, 
  className = '',
  compact = false 
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{experience.title}</h3>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {experience.startDate} - {experience.endDate || 'Present'}
        </span>
      </div>
      <p className={`text-sm ${compact ? '' : 'mb-2'}`}>
        {experience.company}{experience.location ? ` - ${experience.location}` : ''}
      </p>
      
      <ul className={`pl-5 ${compact ? 'space-y-0.5 text-xs' : 'space-y-1 text-sm'}`}>
        {experience.responsibilities.map((resp, idx) => (
          <li key={idx} className="list-decimal">{safeToString(resp)}</li>
        ))}
      </ul>

      {isValidArray(experience.subSections) && (
        <div className={`mt-1 ${compact ? 'space-y-1' : 'space-y-2'}`}>
          {experience.subSections.map((section, idx) => (
            <div key={idx} className="ml-2">
              {section.title && (
                <h4 className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                  {safeToString(section.title)}
                </h4>
              )}
              <ul className={`pl-5 ${compact ? 'space-y-0.5 text-xs' : 'space-y-1 text-sm'}`}>
                {section.details.map((detail, detailIdx) => (
                  <li key={detailIdx} className="list-disc">{safeToString(detail)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;
