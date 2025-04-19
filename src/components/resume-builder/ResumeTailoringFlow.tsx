
import React, { useState } from 'react';
import { JobPosting, Resume, MatchData } from '@/types/resume';
import { defaultJobPosting, defaultResume } from '@/data/resume-data';
import { ResumeAnalysisStep } from './ResumeAnalysisStep';
import { ResumeCustomizationStep } from './ResumeCustomizationStep';
import { ResumePreviewStep } from './creation-steps/ResumePreviewStep';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResumeTailoringFlowProps {
  jobPosting?: JobPosting;
  onClose: () => void;
}

export const ResumeTailoringFlow: React.FC<ResumeTailoringFlowProps> = ({ 
  jobPosting = defaultJobPosting, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [matchData, setMatchData] = useState<MatchData>({
    initialScore: 6.5,
    finalScore: 0,
    titleMatch: false,
    experienceMatch: true,
    industryMatches: ['Technology'],
    skillMatches: ['JavaScript', 'React', 'TypeScript'],
    missingSkills: ['Next.js', 'AWS', 'GraphQL'],
    summaryMatch: false
  });

  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    skills: true,
    experience: true,
    editMode: 'quick' as 'quick' | 'full'
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalResume, setOriginalResume] = useState<Resume>(defaultResume);
  const [tailoredResume, setTailoredResume] = useState<Resume>(defaultResume);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      handleNext();
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ResumeAnalysisStep
            resume={originalResume}
            jobPosting={jobPosting}
            matchData={matchData}
            onContinue={handleNext}
            userResumes={[]}
          />
        );
      case 2:
        return (
          <ResumeCustomizationStep
            matchData={matchData}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      case 3:
        return (
          <ResumePreviewStep
            originalResume={originalResume}
            tailoredResume={tailoredResume}
            setTailoredResume={setTailoredResume}
            matchData={matchData}
            selectedSections={selectedSections}
            selectedSkills={selectedSkills}
            jobPosting={jobPosting}
            isLoading={false}
            onSave={() => {}}
            onDownload={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6">
        {renderStepContent()}

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            onClick={handleBack}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 3
          </div>
        </div>
      </Card>
    </div>
  );
};
