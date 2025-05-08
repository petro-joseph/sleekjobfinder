
import React, { useState } from 'react';
import { Check, Download, Edit, Save, X, ThumbsUp, ThumbsDown, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Resume, MatchData } from '@/types/resume';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ResumePreviewStepProps {
  originalResume: Resume;
  tailoredResume: Resume;
  setTailoredResume: React.Dispatch<React.SetStateAction<Resume | null>>;
  matchData: MatchData;
  selectedSkills: string[];
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
  onFeedback: (positive: boolean) => void;
  credits: number;
}

export const ResumePreviewStep: React.FC<ResumePreviewStepProps> = ({
  originalResume,
  tailoredResume,
  setTailoredResume,
  matchData,
  selectedSkills,
  template,
  setTemplate,
  onFeedback,
  credits
}) => {
  const [editing, setEditing] = useState<{
    section: 'summary' | 'skiills' | 'experience' | 'education' | 'projects' | null;
    index?: number;
  }>({ section: null });
  
  const [editValues, setEditValues] = useState<{
    summary?: string;
    skills?: string[];
    experience?: {
      index: number;
      responsibilities: string[];
    };
    education?: {
      index: number;
      institution?: string;
      degree?: string;
      startDate?: string;
      endDate?: string;
    };
    project?: {
      index: number;
      title?: string;
      date?: string;
      description?: string;
    };
  }>({});
  
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  
  const startEditing = (section: 'summary' | 'skills' | 'experience' | 'education' | 'projects', index?: number) => {
    setEditing({ section, index });
    
    // Initialize edit values based on section
    if (section === 'summary') {
      setEditValues({ summary: tailoredResume.summary });
    } else if (section === 'skills') {
      setEditValues({ skills: [...tailoredResume.skills] });
    } else if (section === 'experience' && typeof index === 'number') {
      setEditValues({ 
        experience: {
          index,
          responsibilities: [...tailoredResume.workExperiences[index].responsibilities]
        }
      });
    } else if (section === 'education' && typeof index === 'number') {
      const edu = tailoredResume.education[index];
      setEditValues({
        education: {
          index,
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate
        }
      });
    } else if (section === 'projects' && typeof index === 'number') {
      const proj = tailoredResume.projects[index];
      setEditValues({
        project: {
          index,
          title: proj.title,
          date: proj.date,
          description: proj.description
        }
      });
    }
  };
  
  const cancelEditing = () => {
    setEditing({ section: null });
    setEditValues({});
  };
  
  const saveEdits = () => {
    const updated = { ...tailoredResume };
    
    if (editing.section === 'summary' && editValues.summary) {
      updated.summary = editValues.summary;
    } else if (editing.section === 'skills' && editValues.skills) {
      updated.skills = editValues.skills;
    } else if (editing.section === 'experience' && editValues.experience && typeof editing.index === 'number') {
      updated.workExperiences[editing.index].responsibilities = editValues.experience.responsibilities;
    } else if (editing.section === 'education' && editValues.education && typeof editing.index === 'number') {
      const edu = editValues.education;
      if (edu.institution) updated.education[editing.index].institution = edu.institution;
      if (edu.degree) updated.education[editing.index].degree = edu.degree;
      if (edu.startDate) updated.education[editing.index].startDate = edu.startDate;
      if (edu.endDate) updated.education[editing.index].endDate = edu.endDate;
    } else if (editing.section === 'projects' && editValues.project && typeof editing.index === 'number') {
      const proj = editValues.project;
      if (proj.title) updated.projects[editing.index].title = proj.title;
      if (proj.date) updated.projects[editing.index].date = proj.date;
      if (proj.description) updated.projects[editing.index].description = proj.description;
    }
    
    setTailoredResume(updated);
    setEditing({ section: null });
    setEditValues({});
  };
  
  // Handlers for skill editing
  const addSkill = (skill: string) => {
    if (editValues.skills && !editValues.skills.includes(skill)) {
      setEditValues({ skills: [...editValues.skills, skill] });
    }
  };
  
  const removeSkill = (skill: string) => {
    if (editValues.skills) {
      setEditValues({ skills: editValues.skills.filter(s => s !== skill) });
    }
  };
  
  // Handler for work experience editing
  const updateResponsibility = (index: number, value: string) => {
    if (editValues.experience) {
      const updated = [...editValues.experience.responsibilities];
      updated[index] = value;
      setEditValues({ 
        experience: {
          index: editValues.experience.index,
          responsibilities: updated
        }
      });
    }
  };
  
  const addResponsibility = () => {
    if (editValues.experience) {
      setEditValues({
        experience: {
          index: editValues.experience.index,
          responsibilities: [...editValues.experience.responsibilities, '']
        }
      });
    }
  };
  
  const removeResponsibility = (index: number) => {
    if (editValues.experience) {
      const updated = editValues.experience.responsibilities.filter((_, i) => i !== index);
      setEditValues({
        experience: {
          index: editValues.experience.index,
          responsibilities: updated
        }
      });
    }
  };
  
  const getScoreLabel = (score: number) => {
    if (score < 5) return "Poor";
    if (score < 7) return "Fair";
    return "Good";
  };
  
  const getScoreColor = (score: number) => {
    if (score < 5) return "text-red-500";
    if (score < 7) return "text-yellow-500";
    return "text-green-500";
  };
  
  const getGaugeStyle = (score: number) => {
    const percentage = (score / 10) * 100;
    let color;
    if (score < 5) color = '#ef4444';
    else if (score < 7) color = '#f59e0b';
    else color = '#22c55e';

    return {
      background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}% 100%)`,
    };
  };
  
  const handleDownload = (format: 'pdf' | 'docx') => {
    // In a real implementation, this would generate and download the file
    // For now, we'll just show a toast message
    alert(`Downloading resume as ${format.toUpperCase()}`);
  };
  
  const submitFeedback = () => {
    alert(`Feedback submitted: ${feedbackText}`);
    setShowFeedbackInput(false);
    setFeedbackText('');
  };
  
  return (
    <div className="grid md:grid-cols-10 gap-6">
      {/* Main Content - Resume Preview (70%) */}
      <div className="md:col-span-7 space-y-6">
        {/* Use theme-aware background */}
        <div className={`bg-card text-card-foreground rounded-lg border p-6 ${template === 'compact' ? 'space-y-3' : 'space-y-6'}`}>
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">{tailoredResume.name}</h1>
            <div className={`flex flex-wrap justify-center gap-x-4 ${template === 'compact' ? 'mt-1' : 'mt-2'}`}>
              <a href={`tel:${tailoredResume.contactInfo.phone}`} className="text-primary hover:underline">
                {tailoredResume.contactInfo.phone}
              </a>
              <a href={`mailto:${tailoredResume.contactInfo.email}`} className="text-primary hover:underline">
                {tailoredResume.contactInfo.email}
              </a>
              <a href={`https://${tailoredResume.contactInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {tailoredResume.contactInfo.linkedin}
              </a>
            </div>
          </div>
          
          {/* Summary */}
          <div className="relative group">
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                className="p-1 bg-green-500 rounded-full text-white"
                onClick={() => startEditing('summary')}
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>
            
            <div>
              <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                Professional Summary
              </h2>
              
              {editing.section === 'summary' ? (
                <div className="space-y-2">
                  <Textarea 
                    value={editValues.summary}
                    onChange={(e) => setEditValues({ summary: e.target.value })}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdits}>
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p>{tailoredResume.summary}</p>
              )}
            </div>
          </div>
          
          {/* Skills */}
          <div className="relative group">
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                className="p-1 bg-green-500 rounded-full text-white"
                onClick={() => startEditing('skills')}
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>
            
            <div>
              <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                Skills
              </h2>
              
              {editing.section === 'skills' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editValues.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center" // Use theme-aware background
                      >
                        {skill}
                        <button
                          className="ml-1 text-red-500"
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <Input 
                      placeholder="Add a skill..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          addSkill(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdits}>
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tailoredResume.skills.map((skill, index) => (
                    <span
                      key={index}
                      // Use theme-aware backgrounds for skills
                      className={`rounded-full px-3 py-1 text-sm ${
                        selectedSkills.includes(skill)
                          ? 'bg-green-500/10 text-green-700 dark:bg-green-900/20 dark:text-green-400' // Highlight added skills
                          : 'bg-secondary text-secondary-foreground' // Default skill background
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Work Experience */}
          <div>
            <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
              Professional Experience
            </h2>
            
            <div className={`space-y-${template === 'compact' ? '2' : '4'}`}>
              {tailoredResume.workExperiences.map((experience, expIndex) => (
                <div key={expIndex} className="relative group">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      className="p-1 bg-green-500 rounded-full text-white"
                      onClick={() => startEditing('experience', expIndex)}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold">{experience.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {experience.startDate} - {experience.endDate || 'Present'}
                      </span>
                    </div>
                    <p className={`text-lg ${template === 'compact' ? 'mb-1' : 'mb-2'}`}>{experience.company}, {experience.location}</p>
                    
                    {editing.section === 'experience' && editing.index === expIndex ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {editValues.experience?.responsibilities.map((resp, rIndex) => (
                            <div key={rIndex} className="flex gap-2">
                              <Textarea 
                                value={resp}
                                onChange={(e) => updateResponsibility(rIndex, e.target.value)}
                                className="flex-1"
                                rows={2}
                              />
                              <button 
                                className="text-red-500 self-start mt-2"
                                onClick={() => removeResponsibility(rIndex)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addResponsibility}
                            className="flex-1"
                          >
                            Add Responsibility
                          </Button>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={cancelEditing}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={saveEdits}>
                            <Save className="mr-1 h-3 w-3" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ul className={`list-disc pl-5 ${template === 'compact' ? 'space-y-0.5' : 'space-y-1'}`}>
                        {experience.responsibilities.map((resp, rIndex) => (
                          <li key={rIndex}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education */}
          <div>
            <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
              Education
            </h2>
            
            <div className={`space-y-${template === 'compact' ? '2' : '3'}`}>
              {tailoredResume.education.map((edu, eduIndex) => (
                <div key={eduIndex} className="relative group">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      className="p-1 bg-green-500 rounded-full text-white"
                      onClick={() => startEditing('education', eduIndex)}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <span className="text-sm text-muted-foreground">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p>{edu.institution}{edu.gpa ? `, GPA: ${edu.gpa}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Projects */}
          <div>
            <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
              Projects
            </h2>
            
            <div className={`space-y-${template === 'compact' ? '2' : '3'}`}>
              {tailoredResume.projects.map((project, projIndex) => (
                <div key={projIndex} className="relative group">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      className="p-1 bg-green-500 rounded-full text-white"
                      onClick={() => startEditing('projects', projIndex)}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold">{project.title}</h3>
                      <span className="text-sm text-muted-foreground">{project.date}</span>
                    </div>
                    <p>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      
      </div>
      
      {/* Sidebar (30%) */}
      <div className="md:col-span-3 space-y-6">
        {/* Match Score */}
        <div className="bg-card text-card-foreground rounded-lg border p-6"> {/* Use theme-aware background */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2">
              <div 
                className="w-full h-full rounded-full"
                style={getGaugeStyle(matchData.finalScore)}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* Use theme-aware background for inner circle */}
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{matchData.finalScore}/10</span>
                </div>
              </div>
            </div>
            <p className={`text-base font-medium ${getScoreColor(matchData.finalScore)}`}>
              {getScoreLabel(matchData.finalScore)}
            </p>
          </div>
          
          <p className="text-center mb-2">
            Great! Your score jumped from {matchData.initialScore} to {matchData.finalScore}, closer to landing that interview!
          </p>
        </div>
        
        {/* What's Changed */}
        <div className="bg-card text-card-foreground rounded-lg border"> {/* Use theme-aware background */}
          <h3 className="text-lg font-bold p-4 border-b">What's Changed</h3>

          <Collapsible defaultOpen className="border-b">
             {/* Use theme-aware hover */}
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center text-left">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Summary Enhanced</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
              We've rewritten the summary to align with the job, emphasizing key skills and responsibilities.
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible defaultOpen className="border-b">
             {/* Use theme-aware hover */}
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center text-left">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Missing Skills Added</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
              <p>Added {selectedSkills.length} missing skills that are relevant to the job:</p>
              <ul className="list-disc pl-5 mt-1">
                {selectedSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible defaultOpen>
             {/* Use theme-aware hover */}
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center text-left">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Work Experience Enhanced</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
              Updated descriptions to highlight relevant achievements and incorporate job-specific keywords.
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Template Options */}
        <div className="bg-card text-card-foreground rounded-lg border p-4"> {/* Use theme-aware background */}
          <h3 className="text-lg font-bold mb-3">Template Options</h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="standard-template"
                checked={template === 'standard'}
                onChange={() => setTemplate('standard')}
                className="h-4 w-4 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary dark:focus:ring-offset-gray-800" // Dark mode for radio
              />
              <label htmlFor="standard-template" className="text-sm">
                Standard (full layout, normal spacing)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="compact-template"
                checked={template === 'compact'}
                onChange={() => setTemplate('compact')}
                className="h-4 w-4 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary dark:focus:ring-offset-gray-800" // Dark mode for radio
              />
              <label htmlFor="compact-template" className="text-sm">
                Compact (tighter spacing, smaller margins)
              </label>
            </div>
          </div>
        </div>
        
        {/* Feedback */}
        <div className="bg-card text-card-foreground rounded-lg border p-4"> 
          <h3 className="text-lg font-bold mb-3">How's Your Resume?</h3>

          {showFeedbackInput ? (
            <div className="space-y-3">
              <Textarea 
                placeholder="Tell us what you expected or how we can improve..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFeedbackInput(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={submitFeedback} disabled={!feedbackText.trim()}>
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => onFeedback(true)}
                variant="outline"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Looks Great!
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => {
                  setShowFeedbackInput(true);
                  onFeedback(false);
                }}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Not What I Expected
              </Button>
            </div>
          )}
        </div>
        
        {/* Edit Base Resume Warning */}
        <div className="bg-card text-card-foreground rounded-lg border p-4"> {/* Use theme-aware background */}
          <Button
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Base Resume
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Changes made here apply to your base resume and affect future resumes.
          </p>
        </div>
      </div>
    </div>
  );
};
