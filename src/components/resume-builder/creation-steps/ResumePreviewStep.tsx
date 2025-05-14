
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronRight } from 'lucide-react';
import { Resume } from '@/types/resume';
import { Separator } from '../../ui/separator';
import { ResumeSection } from '../preview/ResumeSection';
import PersonalInfoCard from '../preview/PersonalInfoCard';
import ExperienceCard from '../preview/ExperienceCard';
import EducationCard from '../preview/EducationCard';
import SkillsDisplay from '../preview/SkillsDisplay';
import SummaryCard from '../preview/SummaryCard';

interface ResumePreviewStepProps {
  resumeData: Resume;
  data?: Partial<Resume>;
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
        <h3 className="font-medium text-lg mb-2">Personal Information</h3>
        <PersonalInfoCard resumeData={resumeData} />
      </div>

      {/* Work Experience */}
      <div>
        <h3 className="font-medium text-lg mb-2">Work Experience</h3>
        {resumeData.workExperiences?.map((exp, index) => (
          <ExperienceCard key={index} experience={exp} />
        ))}
      </div>

      {/* Education */}
      <div>
        <h3 className="font-medium text-lg mb-2">Education</h3>
        {resumeData.education?.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </div>

      {/* Skills */}
      <div>
        <h3 className="font-medium text-lg mb-2">Skills</h3>
        <SkillsDisplay skills={resumeData.skills || []} />
      </div>

      {/* Summary */}
      <div>
        <h3 className="font-medium text-lg mb-2">Professional Summary</h3>
        <SummaryCard summary={resumeData.summary} />
      </div>

      <Separator className="my-6" />
      
      <Button onClick={handleContinue} className="w-full">
        Continue to Templates
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
