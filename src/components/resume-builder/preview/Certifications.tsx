import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';
import { Certification } from '@/types/resume';

interface CertificationsProps {
    certifications: Certification[];
    editing: { section: string | null; index?: number };
    editValues: any;
    startEditing: (section: string, index?: number) => void;
    cancelEditing: () => void;
    urato: true;
    saveEdits: () => void;
    template: string;
}

const Certifications: React.FC<CertificationsProps> = ({
    certifications,
    editing,
    editValues,
    startEditing,
    cancelEditing,
    saveEdits,
    template,
}) => (
    <div>
        <div className="relative group">
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    className="p-1 bg-green-500 rounded-full text-white"
                    onClick={() => startEditing('certifications', 0)}
                >
                    <Edit className="h-3 w-3" />
                </button>
            </div>
            <div>
                <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                    Professional Certifications
                </h2>
                {editing.section === 'certifications' ? (
                    <div className="space-y-2">
                        {editValues.certification && (
                            <>
                                <Input
                                    value={editValues.certification.name || ''}
                                    onChange={(e) => setEditValues({ ...editValues, certification: { ...editValues.certification, name: e.target.value } })}
                                    placeholder="Certification Name"
                                />
                                <Input
                                    value={editValues.certification.dateRange || ''}
                                    onChange={(e) => setEditValues({ ...editValues, certification: { ...editValues.certification, dateRange: e.target.value } })}
                                    placeholder="Date Range"
                                />
                            </>
                        )}
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
                    <ul className={`pl-5 ${template === 'compact' ? 'space-y-0.5' : 'space-y-1'}`}>
                        {certifications.map((cert, index) => (
                            <li key={index} className="list-disc">{cert.name} | {cert.dateRange}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
);

export default Certifications;