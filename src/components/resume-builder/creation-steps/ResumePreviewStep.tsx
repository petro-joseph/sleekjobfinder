
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronRight } from 'lucide-react';
import { Resume } from '@/types/resume';
import { Separator } from '../../ui/separator';
import { ResumeSection } from '../preview/ResumeSection';
import { PersonalInfoCard } from '../preview/PersonalInfoCard';
import { ExperienceCard } from '../preview/ExperienceCard';
import { EducationCard } from '../preview/EducationCard';
import { SkillsDisplay } from '../preview/SkillsDisplay';
import { SummaryCard } from '../preview/SummaryCard';

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
      <ResumeSection title="Personal Information">
        <PersonalInfoCard resumeData={resumeData} />
      </ResumeSection>

      {/* Work Experience */}
      <ResumeSection title="Work Experience">
        {resumeData.workExperiences?.map((exp, index) => (
          <ExperienceCard key={index} experience={exp} />
        ))}
      </ResumeSection>

      {/* Education */}
      <ResumeSection title="Education">
        {resumeData.education?.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </ResumeSection>

      {/* Skills */}
      <ResumeSection title="Skills">
        <SkillsDisplay skills={resumeData.skills || []} />
      </ResumeSection>

      {/* Summary */}
      <ResumeSection title="Professional Summary">
        <SummaryCard summary={resumeData.summary} />
      </ResumeSection>

      <Separator className="my-6" />
      
      <Button onClick={handleContinue} className="w-full">
        Continue to Templates
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
