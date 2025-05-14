
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

      <ResumeSection title="Personal Information" section="personalInfo">
        <PersonalInfoCard resumeData={resumeData} />
      </ResumeSection>

      <ResumeSection title="Work Experience" section="workExperience">
        {resumeData.workExperiences?.map((exp, index) => (
          <ExperienceCard key={index} experience={exp} />
        ))}
      </ResumeSection>

      <ResumeSection title="Education" section="education">
        {resumeData.education?.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </ResumeSection>

      <ResumeSection title="Skills" section="skills">
        <SkillsDisplay skills={resumeData.skills || []} />
      </ResumeSection>

      <ResumeSection title="Professional Summary" section="summary">
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
