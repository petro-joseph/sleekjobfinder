
import React from 'react';
import { Resume } from '@/types/resume';

interface PersonalInfoCardProps {
  resumeData: Resume;
  className?: string;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ resumeData, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm">
            <span className="font-semibold">Name:</span> {resumeData.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Title:</span> {resumeData.jobTitle}
          </p>
        </div>
        <div>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span> {resumeData.contactInfo.phone}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Email:</span> {resumeData.contactInfo.email}
          </p>
          {resumeData.contactInfo.linkedin && (
            <p className="text-sm">
              <span className="font-semibold">LinkedIn:</span> {resumeData.contactInfo.linkedin}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
