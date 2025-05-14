
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Save, X } from 'lucide-react';

interface AdditionalSkillsProps {
  skills: string[];
  editing: { section: string | null; index?: number };
  editValues: any;
  startEditing: (section: string, index?: number) => void;
  cancelEditing: () => void;
  saveEdits: () => void;
  template: string;
}

const AdditionalSkills: React.FC<AdditionalSkillsProps> = ({
  skills,
  editing,
  editValues,
  startEditing,
  cancelEditing,
  saveEdits,
  template,
}) => {
  const isEditing = editing.section === 'additionalSkills';
  const [newSkill, setNewSkill] = React.useState('');

  const addSkill = (skill: string) => {
    if (!skill.trim() || !editValues.additionalSkills) return;
    
    if (!editValues.additionalSkills.includes(skill.trim())) {
      editValues.additionalSkills = [...editValues.additionalSkills, skill.trim()];
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    if (!editValues.additionalSkills) return;
    
    editValues.additionalSkills = editValues.additionalSkills.filter(
      (s: string) => s !== skill
    );
  };

  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 bg-green-500 rounded-full text-white"
          onClick={() => startEditing('additionalSkills')}
        >
          <Edit className="h-3 w-3" />
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
          
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(newSkill);
                }
              }}
            />
            <Button onClick={() => addSkill(newSkill)}>Add</Button>
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
