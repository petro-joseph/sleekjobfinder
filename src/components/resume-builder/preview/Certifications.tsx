
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Save, X } from 'lucide-react';

interface Certification {
  name: string;
  dateRange: string;
}

interface CertificationsProps {
  certifications: Certification[];
  editing: { section: string | null; index?: number };
  editValues: any;
  startEditing: (section: string, index?: number) => void;
  cancelEditing: () => void;
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
}) => {
  const isEditing = editing.section === 'certifications';

  const updateCertification = (index: number, field: string, value: string) => {
    if (!editValues.certifications) return;
    
    const updatedCertifications = [...editValues.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    
    editValues.certifications = updatedCertifications;
  };

  const addCertification = () => {
    if (!editValues.certifications) return;
    
    editValues.certifications = [
      ...editValues.certifications,
      { name: '', dateRange: '' }
    ];
  };

  const removeCertification = (index: number) => {
    if (!editValues.certifications) return;
    
    editValues.certifications = editValues.certifications.filter((_: any, i: number) => i !== index);
  };

  return (
    <div className="relative group">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-1 bg-green-500 rounded-full text-white"
          onClick={() => startEditing('certifications')}
        >
          <Edit className="h-3 w-3" />
        </button>
      </div>
      <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
        Professional Certifications
      </h2>
      {isEditing ? (
        <div className="space-y-4">
          {editValues.certifications?.map((cert: Certification, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Input
                  value={cert.name || ''}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  placeholder="Certification name"
                  className="mb-1"
                />
                <Input
                  value={cert.dateRange || ''}
                  onChange={(e) => updateCertification(index, 'dateRange', e.target.value)}
                  placeholder="Date range (e.g., Jan 2023 - Feb 2024)"
                />
              </div>
              <Button 
                size="icon" 
                variant="destructive"
                onClick={() => removeCertification(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={addCertification} 
            className="flex items-center"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Certification
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
        <ul className={`${template === 'compact' ? 'space-y-1' : 'space-y-2'}`}>
          {certifications.map((cert, index) => (
            <li key={index} className="text-sm">
              <span className="font-medium">{cert.name}</span>
              {cert.dateRange && <span className="text-muted-foreground"> | {cert.dateRange}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Certifications;
