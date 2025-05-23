
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { PersonalInfoStep } from './creation-steps/PersonalInfoStep';
import { WorkExperienceStep } from './creation-steps/WorkExperienceStep';
import { EducationStep } from './creation-steps/EducationStep';
import { SkillsStep } from './creation-steps/SkillsStep';
import { SummaryStep } from './creation-steps/SummaryStep';
import { Resume, MatchData } from '@/types/resume';
import { ResumePreviewStep as CreationResumePreviewStep } from './creation-steps/ResumePreviewStep';
import { ResumeTemplateStep } from './creation-steps/ResumeTemplateStep';

interface ResumeCreationFlowProps {
  onBack: () => void;
  onComplete: (resume: Resume) => void;
}

const STEPS = [
  { id: 1, title: "Personal Info", component: PersonalInfoStep },
  { id: 2, title: "Work Experience", component: WorkExperienceStep },
  { id: 3, title: "Education", component: EducationStep },
  { id: 4, title: "Skills", component: SkillsStep },
  { id: 5, title: "Summary", component: SummaryStep },
  { id: 6, title: "Review", component: CreationResumePreviewStep },
  { id: 7, title: "Templates", component: ResumeTemplateStep },
];

export const ResumeCreationFlow: React.FC<ResumeCreationFlowProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Resume>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional");

  const handleNext = (stepData: Partial<Resume>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData as Resume);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  // Render the appropriate component based on the current step
  const renderStepComponent = () => {
    // For all step components we need to provide at least these common props
    const commonProps = {
      data: formData,
      onNext: handleNext,
      resumeData: formData as Resume, // Add resumeData for all steps
    };

    // For Resume Preview Step (step 6)
    if (currentStep === 6) {
      return (
        <CreationResumePreviewStep
          {...commonProps}
        />
      );
    } 
    // For Template Step (step 7)
    else if (currentStep === 7) {
      return (
        <ResumeTemplateStep
          {...commonProps}
          onSelectTemplate={handleTemplateSelect}
          selectedTemplate={selectedTemplate}
        />
      );
    } 
    // For all other steps (1-5)
    else {
      const CurrentStepComponent = STEPS[currentStep - 1].component;
      return <CurrentStepComponent {...commonProps} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 px-4">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center text-center ${
              step.id > currentStep ? 'opacity-50' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                step.id === currentStep
                  ? 'border-2 border-primary bg-primary text-primary-foreground'
                  : step.id < currentStep
                  ? 'bg-primary/20 text-primary'
                  : 'border-2 border-border'
              }`}
            >
              {step.id}
            </div>
            <span className="text-sm hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card className="p-6">
        {renderStepComponent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={handleBack}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {STEPS.length}
        </div>
      </div>
    </div>
  );
};
