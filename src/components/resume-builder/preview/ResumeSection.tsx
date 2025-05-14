
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface ResumeSectionProps {
  title: string;
  section: string;
  editing?: { section: string | null; index?: number };
  editValues?: any;
  startEditing?: (section: string, index?: number) => void;
  cancelEditing?: () => void;
  saveEdits?: () => void;
  content?: React.ReactNode;
  editContent?: React.ReactNode;
  template?: string;
  children?: React.ReactNode; // Added children prop
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  title,
  section,
  editing,
  editValues,
  startEditing,
  cancelEditing,
  saveEdits,
  content,
  editContent,
  template,
  children, // Include children in the props
}) => {
  const isEditing = editing?.section === section && (editing.index === undefined);
  
  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {startEditing && (
          <button
            className="p-1 bg-green-500 rounded-full text-white"
            onClick={() => startEditing(section)}
          >
            <Edit className="h-3 w-3" />
          </button>
        )}
      </div>
      <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
        {title}
      </h2>
      {isEditing && editContent ? (
        <div className="space-y-4">
          {editContent}
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
        <div>{content || children}</div>
      )}
    </div>
  );
};
