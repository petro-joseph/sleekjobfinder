import React from 'react';
import { Resume, MatchData } from '@/types/resume';
import ResumeHeader from './preview/ResumeHeader';
import ResumeSection from './preview/ResumeSection';
import WorkExperience from './preview/WorkExperience';
import Education from './preview/Education';
import Certifications from './preview/Certifications';
import Projects from './preview/Projects';
import AdditionalSkills from './preview/AdditionalSkills';
import ScoreGauge from './preview/ScoreGauge';
import WhatsChanged from './preview/WhatsChanged';
import TemplateOptions from './preview/TemplateOptions';
import FeedbackForm from './preview/FeedbackForm';
import DownloadButtons from './preview/DownloadButtons';
import EditBaseResume from './preview/EditBaseResume';
import useResumeEditing from '@/hooks/useResumeEditing';
import { generatePDF } from '@/utils/generatePDF';
import { generateDOCX } from '@/utils/generateDOCX';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';


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
  const {
    editing,
    editValues,
    startEditing,
    cancelEditing,
    saveEdits,
    addSkill,
    removeSkill,
    addAdditionalSkill,
    removeAdditionalSkill,
    updateResponsibility,
    addResponsibility,
    removeResponsibility,
  } = useResumeEditing(tailoredResume, setTailoredResume);

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      await generatePDF(tailoredResume);
    } else {
      await generateDOCX(tailoredResume);
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
            content={<p>{tailoredResume.summary}</p>}
            editContent={
              <Textarea
                value={editValues.summary || ''}
                onChange={(e) => setEditValues({ ...editValues, summary: e.target.value })}
                rows={4}
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
            content={
              <div className="space-y-1">
                {Object.entries({
                  Technical: tailoredResume.skills.filter(skill =>
                    ['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio'].includes(skill)
                  ),
                  Business: tailoredResume.skills.filter(skill =>
                    ['Project Management', 'Process Improvement', 'Process Automation'].includes(skill)
                  ),
                  'Programming Languages': tailoredResume.skills.filter(skill =>
                    ['PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle'].includes(skill)
                  ),
                  'Web Technologies': tailoredResume.skills.filter(skill =>
                    ['DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS'].includes(skill)
                  ),
                  Languages: tailoredResume.skills.filter(skill =>
                    ['Proficient in English and Swahili'].includes(skill)
                  ),
                }).map(([category, skills]) =>
                  skills.length > 0 && (
                    <p key={category} className="text-sm">
                      <span className="font-semibold">{category}:</span> {skills.join(', ')}
                    </p>
                  )
                )}
              </div>
            }
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
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            saveEdits={saveEdits}
            template={template}
          />
          {tailoredResume.certifications?.length > 0 && (
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
          {tailoredResume.projects?.length > 0 && (
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
          {tailoredResume.additionalSkills?.length > 0 && (
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