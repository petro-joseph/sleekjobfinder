
import React from 'react';

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

  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 bg-green-500 rounded-full text-white"
          onClick={() => startEditing('softSkills')}
        >
          <span className="sr-only">Edit</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
      <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
        Soft Skills
      </h2>
      {isEditing ? (
        <div className="space-y-4">
          {/* Edit form would go here */}
          <div className="flex justify-end space-x-2">
            <button 
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              onClick={cancelEditing}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
              onClick={saveEdits}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
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
