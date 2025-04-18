
import React from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MatchData } from '@/types/resume';

interface ResumeCustomizationStepProps {
  matchData: MatchData;
  selectedSections: {
    summary: boolean;
    skills: boolean;
    experience: boolean;
    editMode: 'quick' | 'full';
  };
  setSelectedSections: React.Dispatch<React.SetStateAction<{
    summary: boolean;
    skills: boolean;
    experience: boolean;
    editMode: 'quick' | 'full';
  }>>;
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ResumeCustomizationStep: React.FC<ResumeCustomizationStepProps> = ({
  matchData,
  selectedSections,
  setSelectedSections,
  selectedSkills,
  setSelectedSkills,
  onGenerate,
  isGenerating
}) => {
  const toggleSection = (section: 'summary' | 'skills' | 'experience') => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setEditMode = (mode: 'quick' | 'full') => {
    setSelectedSections(prev => ({
      ...prev,
      editMode: mode
    }));
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">Align Your Resume</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Sections to Enhance */}
        <div>
          <h3 className="text-xl font-medium mb-4">Choose sections to enhance</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="summary-checkbox"
                checked={selectedSections.summary}
                onChange={() => toggleSection('summary')}
                className="h-4 w-4"
              />
              <Label htmlFor="summary-checkbox" className="font-medium">Professional Summary</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="skills-checkbox"
                checked={selectedSections.skills}
                onChange={() => toggleSection('skills')}
                className="h-4 w-4"
              />
              <Label htmlFor="skills-checkbox" className="font-medium">Skills</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="experience-checkbox"
                checked={selectedSections.experience}
                onChange={() => toggleSection('experience')}
                className="h-4 w-4"
              />
              <Label htmlFor="experience-checkbox" className="font-medium">Work Experience</Label>
            </div>
            
            {selectedSections.experience && (
              <div className="ml-6 space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="quick-edit"
                    checked={selectedSections.editMode === 'quick'}
                    onChange={() => setEditMode('quick')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="quick-edit">
                    <span className="font-medium">Quick Edit</span>
                    <p className="text-sm text-muted-foreground">First 2 key experiences</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="full-edit"
                    checked={selectedSections.editMode === 'full'}
                    onChange={() => setEditMode('full')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="full-edit">
                    <span className="font-medium">Full Edit</span>
                    <p className="text-sm text-muted-foreground">All experiences (longer processing time)</p>
                  </Label>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Skills to Add */}
        <div>
          <h3 className="text-xl font-medium mb-4">Select relevant skills to add</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              These skills are mentioned in the job posting but are missing from your resume.
              Add them if you have experience with these skills.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {matchData.missingSkills.map((skill, index) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={index}
                    onClick={() => toggleSkill(skill)}
                    className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
                      isSelected ? 'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title="Recommended for this job"
                  >
                    {skill}
                    {isSelected ? (
                      <X className="h-3 w-3" onClick={(e) => {
                        e.stopPropagation();
                        toggleSkill(skill);
                      }} />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {selectedSkills.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Selected Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => toggleSkill(skill)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || (!selectedSections.summary && !selectedSections.skills && !selectedSections.experience)}
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="loader mr-2" />
              Generating...
            </>
          ) : (
            <>
              Generate My New Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
