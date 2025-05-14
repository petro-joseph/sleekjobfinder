
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save } from 'lucide-react';
import { Education as EducationType } from '@/types/resume';

interface EducationProps {
    education: EducationType[];
    editing: { section: string | null; index?: number };
    editValues: any;
    setEditValues: (values: any) => void; // Make sure this is required
    startEditing: (section: string, index?: number) => void;
    cancelEditing: () => void;
    saveEdits: () => void;
    template: string;
}

const Education: React.FC<EducationProps> = ({
    education,
    editing,
    editValues,
    setEditValues, // Include this prop
    startEditing,
    cancelEditing,
    saveEdits,
    template,
}) => (
    <div>
        <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
            Education
        </h2>
        <div className={`space-y-${template === 'compact' ? '2' : '3'}`}>
            {education.map((edu, eduIndex) => (
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
                        {editing.section === 'education' && editing.index === eduIndex ? (
                            <div className="space-y-2">
                                <Input
                                    value={editValues.education?.institution || ''}
                                    onChange={(e) => setEditValues({ ...editValues, education: { ...editValues.education, institution: e.target.value } })}
                                    placeholder="Institution"
                                />
                                <Input
                                    value={editValues.education?.degree || ''}
                                    onChange={(e) => setEditValues({ ...editValues, education: { ...editValues.education, degree: e.target.value } })}
                                    placeholder="Degree"
                                />
                                <Input
                                    value={editValues.education?.startDate || ''}
                                    onChange={(e) => setEditValues({ ...editValues, education: { ...editValues.education, startDate: e.target.value } })}
                                    placeholder="Start Date"
                                />
                                <Input
                                    value={editValues.education?.endDate || ''}
                                    onChange={(e) => setEditValues({ ...editValues, education: { ...editValues.education, endDate: e.target.value } })}
                                    placeholder="End Date"
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
                            <>
                                <div className="flex justify-between">
                                    <h3 className="font-bold">{edu.degree}</h3>
                                    <span className="text-sm text-muted-foreground">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                                <p>{edu.institution}{edu.gpa ? `, Graduated with a ${edu.gpa} GPA` : ''}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Education;
