import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';
import { Project } from '@/types/resume';

interface ProjectsProps {
    projects: Project[];
    editing: { section: string | null; index?: number };
    editValues: any;
    startEditing: (section: string, index?: number) => void;
    cancelEditing: () => void;
    saveEdits: () => void;
    template: string;
}

const Projects: React.FC<ProjectsProps> = ({
    projects,
    editing,
    editValues,
    startEditing,
    cancelEditing,
    saveEdits,
    template,
}) => (
    <div>
        <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
            Projects
        </h2>
        <div className={`space-y-${template === 'compact' ? '2' : '3'}`}>
            {projects.map((project, projIndex) => (
                <div key={projIndex} className="relative group">
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                            className="p-1 bg-green-500 rounded-full text-white"
                            onClick={() => startEditing('projects', projIndex)}
                        >
                            <Edit className="h-3 w-3" />
                        </button>
                    </div>
                    <div>
                        {editing.section === 'projects' && editing.index === projIndex ? (
                            <div className="space-y-2">
                                <Input
                                    value={editValues.project?.title || ''}
                                    onChange={(e) => setEditValues({ ...editValues, project: { ...editValues.project, title: e.target.value } })}
                                    placeholder="Project Title"
                                />
                                <Input
                                    value={editValues.project?.date || ''}
                                    onChange={(e) => setEditValues({ ...editValues, project: { ...editValues.project, date: e.target.value } })}
                                    placeholder="Date"
                                />
                                <Textarea
                                    value={editValues.project?.description || ''}
                                    onChange={(e) => setEditValues({ ...editValues, project: { ...editValues.project, description: e.target.value } })}
                                    placeholder="Description"
                                    rows={3}
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
                                    <h3 className="font-bold">{project.title}</h3>
                                    <span className="text-sm text-muted-foreground">{project.date}</span>
                                </div>
                                <p>{project.description}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Projects;