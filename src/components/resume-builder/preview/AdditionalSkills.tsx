
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface AdditionalSkillsProps {
  skills: string[];
  editing: { section: string | null; index?: number };
  editValues: any;
  startEditing: (section: string, index?: number) => void;
  cancelEditing: () => void;
  saveEdits: () => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  template: string;
}

const AdditionalSkills: React.FC<AdditionalSkillsProps> = ({
  skills,
  editing,
  editValues,
  startEditing,
  cancelEditing,
  saveEdits,
  addSkill,
  removeSkill,
  template,
}) => {
  const isEditing = editing.section === 'additionalSkills';

  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 bg-green-500 rounded-full text-white"
          onClick={() => startEditing('additionalSkills')}
        >
          <span className="sr-only">Edit</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
      <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
        Additional Skills
      </h2>
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {editValues.additionalSkills?.map((skill: string, index: number) => (
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
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveEdits}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <ul className={`${template === 'compact' ? 'space-y-0.5 columns-2 md:columns-3' : 'space-y-1 columns-2 md:columns-3'}`}>
          {skills.map((skill, index) => (
            <li key={index} className="text-sm">• {skill}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdditionalSkills;
