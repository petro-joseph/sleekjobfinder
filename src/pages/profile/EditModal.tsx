
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string | null;
  user: any;
  onSave: (section: string, data: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  section,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [newSkill, setNewSkill] = useState('');
  const [skillsArray, setSkillsArray] = useState<string[]>([]);
  const [educationArray, setEducationArray] = useState<any[]>([]);
  const [experienceArray, setExperienceArray] = useState<any[]>([]);

  useEffect(() => {
    if (section === 'personal') {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        bio: user.bio || '',
        location: user.location || '',
      });
    } else if (section === 'skills') {
      setSkillsArray(user.skills || []);
    } else if (section === 'education') {
      setEducationArray(user.education || []);
    } else if (section === 'work') {
      setExperienceArray(user.experience || []);
    } else if (section === 'linkedin') {
      setFormData({
        website: user.website || '',
      });
    }
  }, [section, user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !skillsArray.includes(newSkill.trim())) {
      setSkillsArray([...skillsArray, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skill: string) => {
    setSkillsArray(skillsArray.filter(s => s !== skill));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updated = [...educationArray];
    updated[index] = { ...updated[index], [field]: value };
    setEducationArray(updated);
  };

  const addEducation = () => {
    setEducationArray([
      ...educationArray,
      {
        id: `new-${Date.now()}`,
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationArray(educationArray.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updated = [...experienceArray];
    updated[index] = { ...updated[index], [field]: value };
    setExperienceArray(updated);
  };

  const addExperience = () => {
    setExperienceArray([
      ...experienceArray,
      {
        id: `new-${Date.now()}`,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        summary: '',
        description: '',
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperienceArray(experienceArray.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (section === 'personal' || section === 'linkedin') {
      onSave(section, formData);
    } else if (section === 'skills') {
      onSave('skills', skillsArray);
    } else if (section === 'education') {
      onSave('education', educationArray);
    } else if (section === 'work') {
      onSave('work', experienceArray);
    }
    onClose();
  };

  const renderFormFields = () => {
    switch (section) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Website/LinkedIn</label>
              <Input
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                className="mt-1 h-24"
              />
            </div>
          </div>
        );
      
      case 'linkedin':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add your LinkedIn profile URL to enhance your profile
              </p>
            </div>
          </div>
        );
        
      case 'skills':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Add Skill</label>
              <div className="flex mt-1">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  className="flex-1 rounded-r-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSkillAdd();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleSkillAdd}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {skillsArray.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {skillsArray.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'education':
        return (
          <div className="space-y-6">
            {educationArray.map((edu, index) => (
              <div key={edu.id || index} className="p-4 border rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">School</label>
                    <Input
                      value={edu.school || ''}
                      onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Degree</label>
                      <Input
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Field of Study</label>
                      <Input
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Start Date (YYYY-MM)</label>
                      <Input
                        value={edu.startDate || ''}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        placeholder="2020-09"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date (YYYY-MM or Present)</label>
                      <Input
                        value={edu.endDate || ''}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        placeholder="2024-06 or Present"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={edu.description || ''}
                      onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                      className="mt-1"
                      placeholder="GPA, honors, activities, etc."
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={addEducation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        );
        
      case 'work':
        return (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {experienceArray.map((exp, index) => (
              <div key={exp.id || index} className="p-4 border rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Job Title</label>
                      <Input
                        value={exp.title || ''}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input
                        value={exp.company || ''}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={exp.location || ''}
                      onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Start Date (YYYY-MM)</label>
                      <Input
                        value={exp.startDate || ''}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        placeholder="2020-09"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date (YYYY-MM or Present)</label>
                      <Input
                        value={exp.endDate || ''}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        placeholder="2024-06 or Present"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Summary</label>
                    <Input
                      value={exp.summary || ''}
                      onChange={(e) => handleExperienceChange(index, 'summary', e.target.value)}
                      className="mt-1"
                      placeholder="Brief overview of your role"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-xs text-muted-foreground">Use bullet points, each on a new line starting with "- "</p>
                    <Textarea
                      value={exp.description || ''}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      className="mt-1 h-24"
                      placeholder="- Accomplished X resulting in Y improvement
- Developed Z that led to A outcome"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={addExperience}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (section) {
      case 'personal':
        return 'Edit Personal Information';
      case 'skills':
        return 'Edit Skills';
      case 'education':
        return 'Edit Education';
      case 'work':
        return 'Edit Work Experience';
      case 'employment':
        return 'Edit Equal Employment Information';
      case 'linkedin':
        return 'Update LinkedIn URL';
      default:
        return 'Edit Information';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{renderFormFields()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
