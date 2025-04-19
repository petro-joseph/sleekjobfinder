
import React from 'react';
import { Button } from '../../ui/button';
import { CheckCircle, Download, Save, FileText } from 'lucide-react';
import { Resume } from '@/types/resume';
import { Card, CardContent } from '../../ui/card';
import { Separator } from '../../ui/separator';

interface ResumeTemplateStepProps {
  resumeData: Resume;
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
  onNext: (data: Partial<Resume>) => void;
  data?: Partial<Resume>; // Added to match other steps
}

const TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and formal design perfect for corporate roles"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with creative layout"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simple and elegant with focus on content"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold design for creative industries"
  }
];

export const ResumeTemplateStep: React.FC<ResumeTemplateStepProps> = ({
  resumeData,
  selectedTemplate,
  onSelectTemplate,
  onNext
}) => {
  const handleDownload = (format: 'pdf' | 'docx') => {
    // In a real implementation, this would generate and download the file
    alert(`Your resume is being downloaded as ${format.toUpperCase()}`);
    
    // After download, we would typically move to the next step
    onNext(resumeData);
  };

  const handleSaveToProfile = () => {
    alert("Your resume has been saved to your profile");
    onNext(resumeData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select a professional template for your resume
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                {selectedTemplate === template.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mt-4 h-32 bg-muted rounded flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="font-medium mb-4">Download or Save Your Resume</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => handleDownload('pdf')}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button 
            onClick={() => handleDownload('docx')}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download DOCX
          </Button>
          <Button 
            onClick={handleSaveToProfile}
            variant="secondary"
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            Save to Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
