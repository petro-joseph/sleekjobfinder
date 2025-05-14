
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Save, Trash } from 'lucide-react';
import { WorkExperience as WorkExperienceType } from '@/types/resume';
import { safeToString, isValidArray } from '@/lib/utils';

interface WorkExperienceProps {
    experiences: WorkExperienceType[];
    editing: { section: string | null; index?: number };
    editValues: any;
    startEditing: (section: string, index?: number) => void;
    cancelEditing: () => void;
    saveEdits: () => void;
    updateResponsibility: (index: number, value: string) => void;
    addResponsibility: () => void;
    removeResponsibility: (index: number) => void;
    template: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({
    experiences,
    editing,
    editValues,
    startEditing,
    cancelEditing,
    saveEdits,
    updateResponsibility,
    addResponsibility,
    removeResponsibility,
    template,
}) => (
    <div>
        <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
            Work Experience
        </h2>
        <div className={`space-y-${template === 'compact' ? '2' : '4'}`}>
            {experiences.map((exp, expIndex) => (
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
                            <h3 className="font-bold">{safeToString(exp.title)}</h3>
                            <span className="text-sm text-muted-foreground">
                                {safeToString(exp.startDate)} - {safeToString(exp.endDate || 'Present')}
                            </span>
                        </div>
                        <p className="text-sm">{safeToString(exp.company)}, {safeToString(exp.location)}</p>
                        
                        {editing.section === 'experience' && editing.index === expIndex ? (
                            <div className="mt-2 space-y-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Responsibilities:</p>
                                    {editValues.experience?.responsibilities?.map((resp: string, respIndex: number) => (
                                        <div key={respIndex} className="flex gap-2">
                                            <Textarea
                                                value={resp}
                                                onChange={(e) => updateResponsibility(respIndex, e.target.value)}
                                                className="flex-1 text-sm"
                                                rows={2}
                                            />
                                            <Button 
                                                size="icon" 
                                                variant="destructive"
                                                onClick={() => removeResponsibility(respIndex)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={addResponsibility} 
                                        className="flex items-center"
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Responsibility
                                    </Button>
                                </div>
                                <div className="flex justify-end space-x-2 mt-2">
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
                            <ul className="mt-1 space-y-1 text-sm list-disc list-inside">
                                {exp.responsibilities && exp.responsibilities.map((resp, respIndex) => (
                                    <li key={respIndex}>{safeToString(resp)}</li>
                                ))}
                            </ul>
                        )}
                        
                        {isValidArray(exp.subSections) && (
                            <div className="mt-2">
                                {exp.subSections.map((sub, subIndex) => (
                                    <div key={subIndex} className="mt-2">
                                        <h4 className="font-medium text-sm">{safeToString(sub.title)}</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {Array.isArray(sub.details) && sub.details.map((detail, detailIndex) => (
                                                <li key={detailIndex}>
                                                    {typeof detail === 'string' 
                                                        ? safeToString(detail)
                                                        : typeof detail === 'object' 
                                                            ? `${safeToString(detail.title || '')} - ${safeToString(detail.role || '')}`
                                                            : ''}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default WorkExperience;
