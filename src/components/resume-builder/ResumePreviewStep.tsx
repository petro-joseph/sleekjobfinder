
import React from 'react';
import { Resume, MatchData } from '@/types/resume';
import { generatePDF } from '@/utils/generatePDF';
import { generateDOCX } from '@/utils/generateDOCX';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import modular components
import ResumeHeader from './preview/ResumeHeader';
import { ResumeSection } from './preview/ResumeSection';
import SkillsDisplay from './preview/SkillsDisplay';
import SummaryCard from './preview/SummaryCard';
import ExperienceCard from './preview/ExperienceCard';
import EducationCard from './preview/EducationCard';
import WorkExperience from './preview/WorkExperience';
import Education from './preview/Education';
import Certifications from './preview/Certifications';
import Projects from './preview/Projects';
import AdditionalSkills from './preview/AdditionalSkills';
import SoftSkills from './preview/SoftSkills';
import ScoreGauge from './preview/ScoreGauge';
import WhatsChanged from './preview/WhatsChanged';
import TemplateOptions from './preview/TemplateOptions';
import FeedbackForm from './preview/FeedbackForm';
import DownloadButtons from './preview/DownloadButtons';
import EditBaseResume from './preview/EditBaseResume';

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
  credits,
}) => {
  const { toast } = useToast();
  const [editing, setEditing] = React.useState<{ section: string | null; index?: number }>({ section: null });
  const [editValues, setEditValues] = React.useState<any>({});

  // Start editing a section
  const startEditing = (section: string, index?: number) => {
    let sectionValues: any = {};
    
    // Clone the relevant section for editing
    switch (section) {
      case 'summary':
        sectionValues = { summary: tailoredResume.summary };
        break;
      case 'skills':
        sectionValues = { skills: [...tailoredResume.skills] };
        break;
      case 'experience':
        sectionValues = { 
          experience: {
            ...tailoredResume.workExperiences[index || 0],
            responsibilities: [...tailoredResume.workExperiences[index || 0].responsibilities]
          }
        };
        break;
      case 'education':
        sectionValues = { education: {...tailoredResume.education[index || 0]} };
        break;
      case 'additionalSkills':
        sectionValues = { additionalSkills: tailoredResume.additionalSkills ? [...tailoredResume.additionalSkills] : [] };
        break;
      case 'softSkills':
        sectionValues = { softSkills: tailoredResume.softSkills ? [...tailoredResume.softSkills] : [] };
        break;
      case 'certifications':
        sectionValues = { certifications: tailoredResume.certifications ? [...tailoredResume.certifications] : [] };
        break;
      case 'projects':
        sectionValues = { projects: tailoredResume.projects ? [...tailoredResume.projects] : [] };
        break;
      default:
        break;
    }

    setEditValues(sectionValues);
    setEditing({ section, index });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing({ section: null });
    setEditValues({});
  };

  // Save edits
  const saveEdits = () => {
    const sectionName = editing.section;
    if (!sectionName) return;

    // Create a copy of the resume
    const updatedResume = { ...tailoredResume };

    // Update the appropriate section
    switch (sectionName) {
      case 'summary':
        updatedResume.summary = editValues.summary;
        break;
      case 'skills':
        updatedResume.skills = editValues.skills;
        break;
      case 'experience':
        if (editing.index !== undefined && updatedResume.workExperiences[editing.index]) {
          updatedResume.workExperiences[editing.index].responsibilities = 
            editValues.experience.responsibilities;
        }
        break;
      case 'education':
        if (editing.index !== undefined) {
          updatedResume.education[editing.index] = editValues.education;
        }
        break;
      case 'additionalSkills':
        updatedResume.additionalSkills = editValues.additionalSkills;
        break;
      case 'softSkills':
        updatedResume.softSkills = editValues.softSkills;
        break;
      case 'certifications':
        updatedResume.certifications = editValues.certifications;
        break;
      case 'projects':
        updatedResume.projects = editValues.projects;
        break;
      default:
        break;
    }

    // Update the resume and exit editing mode
    setTailoredResume(updatedResume);
    cancelEditing();
  };

  // Skills management functions
  const addSkill = (skill: string) => {
    if (!editValues.skills) return;
    if (!editValues.skills.includes(skill)) {
      setEditValues({ ...editValues, skills: [...editValues.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    if (!editValues.skills) return;
    setEditValues({ ...editValues, skills: editValues.skills.filter((s: string) => s !== skill) });
  };

  // Additional skills management
  const addAdditionalSkill = (skill: string) => {
    if (!editValues.additionalSkills) return;
    if (!editValues.additionalSkills.includes(skill)) {
      setEditValues({ ...editValues, additionalSkills: [...editValues.additionalSkills, skill] });
    }
  };

  const removeAdditionalSkill = (skill: string) => {
    if (!editValues.additionalSkills) return;
    setEditValues({ ...editValues, additionalSkills: editValues.additionalSkills.filter((s: string) => s !== skill) });
  };

  // Work experience responsibilities management
  const updateResponsibility = (index: number, value: string) => {
    if (!editValues.experience || !editValues.experience.responsibilities) return;
    const updatedResponsibilities = [...editValues.experience.responsibilities];
    updatedResponsibilities[index] = value;
    setEditValues({
      ...editValues,
      experience: {
        ...editValues.experience,
        responsibilities: updatedResponsibilities
      }
    });
  };

  const addResponsibility = () => {
    if (!editValues.experience || !editValues.experience.responsibilities) return;
    setEditValues({
      ...editValues,
      experience: {
        ...editValues.experience,
        responsibilities: [...editValues.experience.responsibilities, ""]
      }
    });
  };

  const removeResponsibility = (index: number) => {
    if (!editValues.experience || !editValues.experience.responsibilities) return;
    const updatedResponsibilities = [...editValues.experience.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setEditValues({
      ...editValues,
      experience: {
        ...editValues.experience,
        responsibilities: updatedResponsibilities
      }
    });
  };

  // PDF and DOCX generation
  const handleDownload = async (format: 'pdf' | 'docx') => {
    try {
      if (format === 'pdf') {
        await generatePDF(tailoredResume, toast);
      } else {
        await generateDOCX(tailoredResume, toast);
      }
    } catch (error) {
      console.error(`Error generating ${format}:`, error);
    }
  };

  return (
    <div className="grid md:grid-cols-10 gap-6">
      <div className="md:col-span-7 space-y-6">
        <div className={`bg-card text-card-foreground rounded-lg border p-6 ${template === 'compact' ? 'space-y-3' : 'space-y-6'}`}>
          <ResumeHeader resume={tailoredResume} template={template} />
          
          <ResumeSection
            title="Professional Summary"
            section="summary"
            editing={editing}
            editValues={editValues}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdits={saveEdits}
            content={<SummaryCard summary={tailoredResume.summary} />}
            editContent={
              <Textarea
                value={editValues.summary || ''}
                onChange={(e) => setEditValues({ ...editValues, summary: e.target.value })}
                rows={4}
                className="w-full"
              />
            }
            template={template}
          />
          
          <ResumeSection
            title="Technical and Business Skills"
            section="skills"
            editing={editing}
            editValues={editValues}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdits={saveEdits}
            content={<SkillsDisplay skills={tailoredResume.skills} />}
            editContent={
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editValues.skills?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {skill}
                      <button className="ml-1 text-red-500" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add a skill..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            }
            template={template}
          />
          
          <WorkExperience
            experiences={tailoredResume.workExperiences}
            editing={editing}
            editValues={editValues}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdits={saveEdits}
            updateResponsibility={updateResponsibility}
            addResponsibility={addResponsibility}
            removeResponsibility={removeResponsibility}
            template={template}
          />
          
          <Education
            education={tailoredResume.education}
            editing={editing}
            editValues={editValues}
            setEditValues={setEditValues}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdits={saveEdits}
            template={template}
          />
          
          {tailoredResume.certifications && tailoredResume.certifications.length > 0 && (
            <Certifications
              certifications={tailoredResume.certifications}
              editing={editing}
              editValues={editValues}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdits={saveEdits}
              template={template}
            />
          )}
          
          {tailoredResume.projects && tailoredResume.projects.length > 0 && (
            <Projects
              projects={tailoredResume.projects}
              editing={editing}
              editValues={editValues}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdits={saveEdits}
              template={template}
            />
          )}
          
          {tailoredResume.additionalSkills && tailoredResume.additionalSkills.length > 0 && (
            <AdditionalSkills
              skills={tailoredResume.additionalSkills}
              editing={editing}
              editValues={editValues}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdits={saveEdits}
              addSkill={addAdditionalSkill}
              removeSkill={removeAdditionalSkill}
              template={template}
            />
          )}
          
          {tailoredResume.softSkills && tailoredResume.softSkills.length > 0 && (
            <SoftSkills
              skills={tailoredResume.softSkills}
              editing={editing}
              editValues={editValues}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              saveEdits={saveEdits}
              template={template}
            />
          )}
        </div>
      </div>
      <div className="md:col-span-3 space-y-6">
        <ScoreGauge matchData={matchData} />
        <WhatsChanged selectedSkills={selectedSkills} />
        <TemplateOptions template={template} setTemplate={setTemplate} />
        <FeedbackForm onFeedback={onFeedback} />
        <DownloadButtons onDownload={handleDownload} />
        <EditBaseResume />
      </div>
    </div>
  );
};

export default ResumePreviewStep;
