
import React from 'react';
import { Card } from '../../ui/card';
import { Resume } from '@/types/resume';

interface PersonalInfoCardProps {
  resumeData: Resume;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ resumeData }) => {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium">Name:</div>
          <div className="col-span-2">{resumeData.name}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium">Job Title:</div>
          <div className="col-span-2">{resumeData.jobTitle}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium">Email:</div>
          <div className="col-span-2">{resumeData.contactInfo.email}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium">Phone:</div>
          <div className="col-span-2">{resumeData.contactInfo.phone}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium">LinkedIn:</div>
          <div className="col-span-2">{resumeData.contactInfo.linkedin}</div>
        </div>
      </div>
    </Card>
  );
};
