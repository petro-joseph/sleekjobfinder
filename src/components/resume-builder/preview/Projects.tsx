
import React from 'react';
import { Project } from '@/types/resume';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Save, X } from 'lucide-react';
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
  
  const updateProject = (index: number, field: string, value: string | string[]) => {
    if (!editValues.projects) return;
    
    const updatedProjects = [...editValues.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    
    editValues.projects = updatedProjects;
  };
  
  const addProject = () => {
    if (!editValues.projects) return;
    
    editValues.projects = [
      ...editValues.projects,
      { title: '', date: '', description: '', technologies: [] }
    ];
  };
  
  const removeProject = (index: number) => {
    if (!editValues.projects) return;
    
    editValues.projects = editValues.projects.filter((_: any, i: number) => i !== index);
  };
  
  const addTechnology = (index: number, tech: string) => {
    if (!editValues.projects) return;
    if (!tech.trim()) return;
    
    const updatedProjects = [...editValues.projects];
    if (!updatedProjects[index].technologies) {
      updatedProjects[index].technologies = [];
    }
    
    if (!updatedProjects[index].technologies.includes(tech.trim())) {
      updatedProjects[index].technologies = [...updatedProjects[index].technologies, tech.trim()];
    }
    
    editValues.projects = updatedProjects;
  };
  
  const removeTechnology = (projectIndex: number, tech: string) => {
    if (!editValues.projects?.[projectIndex]?.technologies) return;
    
    const updatedProjects = [...editValues.projects];
    updatedProjects[projectIndex].technologies = updatedProjects[projectIndex].technologies.filter(
      (t: string) => t !== tech
    );
    
    editValues.projects = updatedProjects;
  };

  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 bg-green-500 rounded-full text-white"
          onClick={() => startEditing('projects')}
        >
          <Edit className="h-3 w-3" />
        </button>
      </div>
      <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
        Projects
      </h2>
      {isEditing ? (
        <div className="space-y-4">
          {editValues.projects?.map((project: Project, index: number) => (
            <div key={index} className="border border-border rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium">Project {index + 1}</h3>
                <Button 
                  size="icon" 
                  variant="destructive"
                  onClick={() => removeProject(index)}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium">Title</label>
                    <Input
                      value={safeToString(project.title)}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      placeholder="Project title"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Date</label>
                    <Input
                      value={safeToString(project.date)}
                      onChange={(e) => updateProject(index, 'date', e.target.value)}
                      placeholder="Jan 2023 - Mar 2023"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Role (Optional)</label>
                  <Input
                    value={safeToString(project.role)}
                    onChange={(e) => updateProject(index, 'role', e.target.value)}
                    placeholder="Your role in the project"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium">Description</label>
                  <Textarea
                    value={safeToString(project.description)}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Brief description of the project"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium">Technologies</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {isValidArray(project.technologies) && project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="flex items-center gap-1">
                        {safeToString(tech)}
                        <button 
                          onClick={() => removeTechnology(index, tech)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a technology..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          e.preventDefault();
                          addTechnology(index, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input && input.value) {
                          addTechnology(index, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={addProject}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Project
          </Button>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button onClick={saveEdits}>
              <Save className="mr-1 h-4 w-4" />
              Save All Projects
            </Button>
          </div>
        </div>
      ) : (
        <div className={`${template === 'compact' ? 'space-y-2' : 'space-y-4'}`}>
          {isValidArray(projects) ? projects.map((project, index) => (
            <div key={index} className="border-t pt-2 first:border-t-0 first:pt-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{safeToString(project.title)}</h3>
                {project.date && <span className="text-sm text-muted-foreground">{safeToString(project.date)}</span>}
              </div>
              {project.role && (
                <p className="text-xs italic">{safeToString(project.role)}</p>
              )}
              <p className="text-sm mt-1">{safeToString(project.description || project.impact || '')}</p>
              
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
