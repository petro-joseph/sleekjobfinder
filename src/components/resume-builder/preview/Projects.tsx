
import React from 'react';
import { Project } from '@/types/resume';
import { Badge } from '@/components/ui/badge';
import { safeToString, isValidArray } from '@/lib/utils';

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
}) => {
  const isEditing = editing.section === 'projects';
  
  // Safe check for projects data
  const hasProjects = isValidArray(projects);

  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-2">
        <h3 className={template === 'compact' ? 'text-md font-bold' : 'text-lg font-bold'}>Projects</h3>
        <button
          onClick={() => startEditing('projects')}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary hover:text-primary/80"
        >
          Edit
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {editValues.projects?.map((project: Project, index: number) => (
              <div key={index} className="space-y-2 p-2 border rounded-md">
                <input
                  value={safeToString(project.title) || ''}
                  onChange={(e) => {
                    const updatedProjects = [...editValues.projects];
                    updatedProjects[index] = { ...updatedProjects[index], title: e.target.value };
                    editValues.projects = updatedProjects;
                  }}
                  className="w-full p-1 border rounded"
                  placeholder="Project Title"
                />
                {/* Add more fields as needed */}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancelEditing} className="px-3 py-1 text-sm bg-gray-200 rounded">
              Cancel
            </button>
            <button onClick={saveEdits} className="px-3 py-1 text-sm bg-primary text-white rounded">
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className={`${template === 'compact' ? 'space-y-2' : 'space-y-4'}`}>
          {hasProjects ? projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{safeToString(project.title)}</h3>
                {project.date && <span className="text-sm text-muted-foreground">{safeToString(project.date)}</span>}
              </div>
              {project.role && (
                <p className="text-xs italic">{safeToString(project.role)}</p>
              )}
              <p className="text-sm">{safeToString(project.description || project.impact || '')}</p>
              
              {/* Display technologies if available */}
              {isValidArray(project.technologies) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies!.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {safeToString(tech)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No projects available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
