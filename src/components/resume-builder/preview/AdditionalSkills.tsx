import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
}) => (
    <div className="relative group">
        <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
                className="p-1 bg-green-500 rounded-full text-white"
                onClick={() => startEditing('additionalSkills')}
            >
                <Edit className="h-3 w-3" />
            </button>
        </div>
        <div>
            <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                Additional Skills
            </h2>
            {editing.section === 'additionalSkills' ? (
                <div className="space-y-3">
                    <div className="space-y-2">
                        {editValues.additionalSkills?.map((skill: string, index: number) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={skill}
                                    onChange={(e) => {
                                        const updated = [...editValues.additionalSkills];
                                        updated[index] = e.target.value;
                                        setEditValues({ ...editValues, additionalSkills: updated });
                                    }}
                                    className="flex-1"
                                />
                                <button
                                    className="text-red-500 self-start mt-2"
                                    onClick={() => removeSkill(skill)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add an additional skill..."
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
                <ul className={`list-disc pl-5 ${template === 'compact' ? 'space-y-0.5' : 'space-y-1'}`}>
                    {skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);

export default AdditionalSkills;