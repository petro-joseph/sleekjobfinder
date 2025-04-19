
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronRight } from 'lucide-react';
import { Resume } from '@/types/resume';
import { Card } from '../../ui/card';
import { Separator } from '../../ui/separator';

interface ResumePreviewStepProps {
  resumeData: Resume;
  onNext: (data: Partial<Resume>) => void;
}

export const ResumePreviewStep: React.FC<ResumePreviewStepProps> = ({
  resumeData,
  onNext
}) => {
  const handleContinue = () => {
    onNext(resumeData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please review the information you've provided before selecting a template
        </p>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="font-medium mb-2">Personal Information</h3>
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
      </div>

      {/* Work Experience */}
      <div>
        <h3 className="font-medium mb-2">Work Experience</h3>
        <div className="space-y-4">
          {resumeData.workExperiences?.map((exp, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <div className="font-medium">{exp.title} at {exp.company}</div>
                <div className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate || 'Present'}</div>
                <div className="text-sm">{exp.location}</div>
                <div>
                  <div className="font-medium mt-2">Responsibilities:</div>
                  <ul className="list-disc pl-5 mt-1">
                    {exp.responsibilities.map((resp, rIndex) => (
                      <li key={rIndex} className="text-sm">{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="font-medium mb-2">Education</h3>
        <div className="space-y-4">
          {resumeData.education?.map((edu, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <div className="font-medium">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                <div className="text-sm">{edu.institution}</div>
                <div className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate}</div>
                {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="font-medium mb-2">Skills</h3>
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {resumeData.skills?.map((skill, index) => (
              <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <div>
        <h3 className="font-medium mb-2">Professional Summary</h3>
        <Card className="p-4">
          <p className="text-sm">{resumeData.summary}</p>
        </Card>
      </div>

      <Separator className="my-6" />
      
      <Button onClick={handleContinue} className="w-full">
        Continue to Templates
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
