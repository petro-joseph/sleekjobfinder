
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Save, X } from 'lucide-react';

interface SoftSkill {
  name: string;
  description: string;
}

interface SoftSkillsProps {
  skills: SoftSkill[];
  editing: { section: string | null; index?: number };
  editValues: any;
  startEditing: (section: string, index?: number) => void;
  cancelEditing: () => void;
  saveEdits: () => void;
  template: string;
}

const SoftSkills: React.FC<SoftSkillsProps> = ({
  skills,
  editing,
  editValues,
  startEditing,
  cancelEditing,
  saveEdits,
  template,
}) => {
  const isEditing = editing.section === 'softSkills';

  const updateSoftSkill = (index: number, field: string, value: string) => {
    if (!editValues.softSkills) return;
    
    const updatedSkills = [...editValues.softSkills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    
    editValues.softSkills = updatedSkills;
  };

  const addSoftSkill = () => {
    if (!editValues.softSkills) return;
    
    editValues.softSkills = [
      ...editValues.softSkills,
      { name: '', description: '' }
    ];
  };

  const removeSoftSkill = (index: number) => {
    if (!editValues.softSkills) return;
    
    editValues.softSkills = editValues.softSkills.filter((_: any, i: number) => i !== index);
  };

  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 bg-green-500 rounded-full text-white"
          onClick={() => startEditing('softSkills')}
        >
          <Edit className="h-3 w-3" />
        </button>
      </div>
      <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
        Soft Skills
      </h2>
      {isEditing ? (
        <div className="space-y-4">
          {editValues.softSkills?.map((skill: SoftSkill, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Input
                  value={skill.name || ''}
                  onChange={(e) => updateSoftSkill(index, 'name', e.target.value)}
                  placeholder="Skill name"
                  className="mb-1"
                />
                <Textarea
                  value={skill.description || ''}
                  onChange={(e) => updateSoftSkill(index, 'description', e.target.value)}
                  placeholder="Brief description"
                  rows={2}
                />
              </div>
              <Button 
                size="icon" 
                variant="destructive"
                onClick={() => removeSoftSkill(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={addSoftSkill} 
            className="flex items-center"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Soft Skill
          </Button>
          
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
        <div className={`${template === 'compact' ? 'space-y-1' : 'space-y-2'}`}>
          {skills.map((skill, index) => (
            <div key={index}>
              <p className="text-sm font-medium">{skill.name}</p>
              {skill.description && <p className="text-xs text-muted-foreground">{skill.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoftSkills;
