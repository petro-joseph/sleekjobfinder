import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    section: string | null;
    user: any;
    onSave?: (section: string, updatedData: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, section, user, onSave }) => {
    const [formData, setFormData] = useState<any>([]);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (section && user) {
            switch (section) {
                case 'personal':
                    setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        bio: user.bio || '',
                        location: user.location || '',
                        website: user.website || '',
                        linkedin: user.linkedin || '',
                    });
                    break;
                case 'education':
                    setFormData(user.education.map((edu: any) => ({
                        ...edu,
                        startDate: edu.startDate ? edu.startDate.replace(/(\d{4})-(\d{2})/, '$1-$2-01') : '',
                        endDate: edu.endDate === 'Present' ? '' : edu.endDate ? edu.endDate.replace(/(\d{4})-(\d{2})/, '$1-$2-01') : '',
                        currentlyStudying: edu.endDate === 'Present',
                    })));
                    break;
                case 'work':
                    setFormData(user.experience.map((exp: any) => ({
                        ...exp,
                        startDate: exp.startDate ? exp.startDate.replace(/(\d{4})-(\d{2})/, '$1-$2-01') : '',
                        endDate: exp.endDate === 'Present' ? '' : exp.endDate ? exp.endDate.replace(/(\d{4})-(\d{2})/, '$1-$2-01') : '',
                        currentlyWorking: exp.endDate === 'Present',
                        jobType: exp.jobType || 'Full-time',
                        description: exp.description ? exp.description.split('\n- ').map((item: string) => item.replace('- ', '')) : [''],
                        summary: exp.summary || '',
                    })));
                    break;
                case 'skills':
                    setFormData([...user.skills]);
                    break;
                case 'employment':
                    setFormData({
                        authorizedToWork: user.jobPreferences?.locations.includes('US') ? 'Yes' : 'No',
                        disability: 'No',
                        gender: 'Male',
                        race: 'Black or African American',
                    });
                    break;
                default:
                    setFormData([]);
            }
            setErrors({});
        }
    }, [section, user]);

    const validateForm = () => {
        const newErrors: any = {};
        switch (section) {
            case 'personal':
                if (!formData.firstName) newErrors.firstName = 'First Name is required';
                if (!formData.lastName) newErrors.lastName = 'Last Name is required';
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
                if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
                    newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
                }
                if (formData.linkedin && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.linkedin)) {
                    newErrors.linkedin = 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)';
                }
                break;
            case 'education':
                formData.forEach((edu: any, index: number) => {
                    const eduErrors: any = {};
                    if (!edu.school) eduErrors.school = 'School is required';
                    if (!edu.degree) eduErrors.degree = 'Qualification is required';
                    if (!edu.startDate) eduErrors.startDate = 'Start Date is required';
                    if (!edu.currentlyStudying && !edu.endDate) eduErrors.endDate = 'End Date is required';
                    if (Object.keys(eduErrors).length > 0) {
                        newErrors[index] = eduErrors;
                    }
                });
                break;
            case 'work':
                formData.forEach((exp: any, index: number) => {
                    const expErrors: any = {};
                    if (!exp.title) expErrors.title = 'Job Title is required';
                    if (!exp.company) expErrors.company = 'Company is required';
                    if (!exp.jobType) expErrors.jobType = 'Job Type is required';
                    if (!exp.startDate) expErrors.startDate = 'Start Date is required';
                    if (!exp.currentlyWorking && !exp.endDate) expErrors.endDate = 'End Date is required';
                    if (Object.keys(expErrors).length > 0) {
                        newErrors[index] = expErrors;
                    }
                });
                break;
            case 'skills':
                formData.forEach((skill: string, index: number) => {
                    if (!skill) newErrors[index] = 'Skill is required';
                });
                break;
            case 'employment':
                if (!formData.authorizedToWork) newErrors.authorizedToWork = 'This field is required';
                if (!formData.disability) newErrors.disability = 'This field is required';
                if (!formData.gender) newErrors.gender = 'This field is required';
                if (!formData.race) newErrors.race = 'This field is required';
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
        let { name, value } = e.target;
        if (name === 'website' || name === 'linkedin') {
            if (value && !/^(https?:\/\/)/.test(value)) {
                value = `https://${value}`;
            }
        }
        if (index !== undefined && field) {
            const updatedData = [...formData];
            updatedData[index] = { ...updatedData[index], [field]: value };
            setFormData(updatedData);
        } else if (section === 'skills' && index !== undefined) {
            const updatedSkills = [...formData];
            updatedSkills[index] = value;
            setFormData(updatedSkills);
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (index !== undefined && field) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                if (newErrors[index]) {
                    delete newErrors[index][field];
                    if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                }
                return newErrors;
            });
        } else if (index !== undefined) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[index];
                return newErrors;
            });
        } else {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (value: string, name: string, index?: number) => {
        if (index !== undefined) {
            const updatedData = [...formData];
            updatedData[index] = { ...updatedData[index], [name]: value };
            setFormData(updatedData);
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                if (newErrors[index]) {
                    delete newErrors[index][name];
                    if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                }
                return newErrors;
            });
        } else {
            setFormData({ ...formData, [name]: value });
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCheckboxChange = (checked: any, index: number, field: string) => {
        const isChecked = typeof checked === 'boolean' ? checked : checked.checked;
        const updatedData = [...formData];
        updatedData[index] = { ...updatedData[index], [field]: isChecked };
        if (field === 'currentlyWorking' && isChecked) {
            updatedData[index].endDate = '';
        }
        setFormData(updatedData);
        setErrors((prev: any) => {
            const newErrors = { ...prev };
            if (newErrors[index] && newErrors[index].endDate && isChecked) {
                delete newErrors[index].endDate;
                if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
            }
            return newErrors;
        });
    };

    const handleBulletPointChange = (index: number, bulletIndex: number, value: string) => {
        const updatedData = [...formData];
        updatedData[index].description[bulletIndex] = value;
        setFormData(updatedData);
    };

    const handleAddBulletPoint = (index: number) => {
        const updatedData = [...formData];
        updatedData[index].description.push('');
        setFormData(updatedData);
    };

    const handleDeleteBulletPoint = (index: number, bulletIndex: number) => {
        const updatedData = [...formData];
        updatedData[index].description = updatedData[index].description.filter((_: any, i: number) => i !== bulletIndex);
        setFormData(updatedData);
    };

    const handleAddEntry = () => {
        if (section === 'education') {
            setFormData([
                ...formData,
                { id: Date.now().toString(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '', currentlyStudying: false },
            ]);
        } else if (section === 'work') {
            setFormData([
                ...formData,
                { id: Date.now().toString(), title: '', company: '', location: '', startDate: '', endDate: '', description: [''], summary: '', currentlyWorking: false, jobType: 'Full-time' },
            ]);
        } else if (section === 'skills') {
            setFormData([...formData, '']);
        }
    };

    const handleDeleteEntry = (index: number) => {
        const updatedData = formData.filter((_: any, i: number) => i !== index);
        setFormData(updatedData);
        setErrors((prev: any) => {
            const newErrors = { ...prev };
            delete newErrors[index];
            return newErrors;
        });
    };

    const handleSave = () => {
        if (!validateForm()) return;
        if (section && onSave) {
            let updatedData = formData;
            if (section === 'education') {
                updatedData = formData.map((edu: any) => ({
                    ...edu,
                    startDate: edu.startDate ? edu.startDate.slice(0, 7) : '',
                    endDate: edu.currentlyStudying ? 'Present' : edu.endDate ? edu.endDate.slice(0, 7) : '',
                }));
            } else if (section === 'work') {
                updatedData = formData.map((exp: any) => ({
                    ...exp,
                    startDate: exp.startDate ? exp.startDate.slice(0, 7) : '',
                    endDate: exp.currentlyWorking ? 'Present' : exp.endDate ? exp.endDate.slice(0, 7) : '',
                    description: exp.description.filter((desc: string) => desc.trim()).join('\n- '),
                    summary: exp.summary || '',
                }));
            } else if (section === 'personal') {
                updatedData = { ...formData };
                updatedData.website = updatedData.website || '';
                updatedData.linkedin = updatedData.linkedin || '';
            }
            onSave(section, updatedData);
        }
        onClose();
    };

    const getModalSize = () => {
        switch (section) {
            case 'education':
            case 'work':
            case 'skills':
                return 'max-w-3xl';
            default:
                return 'max-w-lg';
        }
    };

    const renderForm = () => {
        try {
            switch (section) {
                case 'personal':
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    className="w-full whitespace-normal"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lastName">
                                    Last Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                    className="w-full whitespace-normal"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className="w-full whitespace-normal"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange}
                                    className="w-full whitespace-normal"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio || ''}
                                    onChange={handleInputChange}
                                    className="w-full whitespace-normal"
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location || ''}
                                    onChange={handleInputChange}
                                    className="w-full whitespace-normal"
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website URL</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    value={formData.website || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    className="w-full whitespace-normal"
                                />
                                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                            </div>
                            <div>
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    value={formData.linkedin || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full whitespace-normal"
                                />
                                {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
                            </div>
                        </div>
                    );

                case 'education':
                    if (!Array.isArray(formData)) return <div>Loading...</div>;
                    return (
                        <div className="space-y-4">
                            {formData.map((edu: any, index: number) => (
                                <div key={edu.id} className="border p-4 rounded-lg relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                                        <button
                                            onClick={() => handleDeleteEntry(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`school-${index}`}>
                                                School <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`school-${index}`}
                                                value={edu.school || ''}
                                                onChange={(e) => handleInputChange(e, index, 'school')}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.school && <p className="text-red-500 text-sm mt-1">{errors[index].school}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor={`degree-${index}`}>
                                                Qualification <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`degree-${index}`}
                                                value={edu.degree || ''}
                                                onChange={(e) => handleInputChange(e, index, 'degree')}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.degree && <p className="text-red-500 text-sm mt-1">{errors[index].degree}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                                            <Input
                                                id={`fieldOfStudy-${index}`}
                                                value={edu.fieldOfStudy || ''}
                                                onChange={(e) => handleInputChange(e, index, 'fieldOfStudy')}
                                                className="w-full whitespace-normal"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`startDate-${index}`}>
                                                Start Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`startDate-${index}`}
                                                type="date"
                                                value={edu.startDate || ''}
                                                onChange={(e) => handleInputChange(e, index, 'startDate')}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.startDate && <p className="text-red-500 text-sm mt-1">{errors[index].startDate}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor={`endDate-${index}`}>
                                                End Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`endDate-${index}`}
                                                type="date"
                                                value={edu.endDate || ''}
                                                onChange={(e) => handleInputChange(e, index, 'endDate')}
                                                disabled={edu.currentlyStudying}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.endDate && <p className="text-red-500 text-sm mt-1">{errors[index].endDate}</p>}
                                        </div>
                                        <div className="md:col-span-2 flex items-center space-x-2">
                                            <Checkbox
                                                id={`currentlyStudying-${index}`}
                                                checked={edu.currentlyStudying || false}
                                                onCheckedChange={(checked: any) => handleCheckboxChange(checked, index, 'currentlyStudying')}
                                            />
                                            <Label htmlFor={`currentlyStudying-${index}`}>I currently study here</Label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor={`description-${index}`}>Description</Label>
                                            <Textarea
                                                id={`description-${index}`}
                                                value={edu.description || ''}
                                                onChange={(e) => handleInputChange(e, index, 'description')}
                                                className="w-full whitespace-normal"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={handleAddEntry} variant="outline" className="mt-2">
                                Add Education
                            </Button>
                        </div>
                    );

                case 'work':
                    if (!Array.isArray(formData)) return <div>Loading...</div>;
                    return (
                        <div className="space-y-4">
                            {formData.map((exp: any, index: number) => (
                                <div key={exp.id} className="border p-4 rounded-lg relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Work Experience {index + 1}</h3>
                                        <button
                                            onClick={() => handleDeleteEntry(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <Label htmlFor={`title-${index}`}>
                                                Job Title <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`title-${index}`}
                                                value={exp.title || ''}
                                                onChange={(e) => handleInputChange(e, index, 'title')}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.title && <p className="text-red-500 text-sm mt-1">{errors[index].title}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor={`company-${index}`}>
                                                Company <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`company-${index}`}
                                                value={exp.company || ''}
                                                onChange={(e) => handleInputChange(e, index, 'company')}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.company && <p className="text-red-500 text-sm mt-1">{errors[index].company}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-muted-foreground italic">
                                                <span className="font-semibold">Tips:</span> Pick the company from above for better accuracy
                                            </p>
                                        </div>
                                        <div>
                                            <Label htmlFor={`jobType-${index}`}>
                                                Job Type <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                onValueChange={(value) => handleSelectChange(value, 'jobType', index)}
                                                value={exp.jobType || 'Full-time'}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a job type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                                    <SelectItem value="Contract">Contract</SelectItem>
                                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                                    <SelectItem value="Internship">Internship</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[index]?.jobType && <p className="text-red-500 text-sm mt-1">{errors[index].jobType}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor={`location-${index}`}>Location</Label>
                                            <Input
                                                id={`location-${index}`}
                                                value={exp.location || ''}
                                                onChange={(e) => handleInputChange(e, index, 'location')}
                                                className="w-full whitespace-normal"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`startDate-${index}`}>
                                                Start Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`startDate-${index}`}
                                                type="date"
                                                value={exp.startDate || ''}
                                                onChange={(e) => handleInputChange(e, index, 'startDate')}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.startDate && <p className="text-red-500 text-sm mt-1">{errors[index].startDate}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor={`endDate-${index}`}>
                                                End Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`endDate-${index}`}
                                                type="date"
                                                value={exp.endDate || ''}
                                                onChange={(e) => handleInputChange(e, index, 'endDate')}
                                                disabled={exp.currentlyWorking}
                                                className="w-full whitespace-normal"
                                            />
                                            {errors[index]?.endDate && <p className="text-red-500 text-sm mt-1">{errors[index].endDate}</p>}
                                        </div>
                                        <div className="md:col-span-2 flex items-center space-x-2">
                                            <Checkbox
                                                id={`currentlyWorking-${index}`}
                                                checked={exp.currentlyWorking || false}
                                                onCheckedChange={(checked: any) => handleCheckboxChange(checked, index, 'currentlyWorking')}
                                            />
                                            <Label htmlFor={`currentlyWorking-${index}`}>I currently work here</Label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor={`summary-${index}`}>Experience Summary</Label>
                                            <Textarea
                                                id={`summary-${index}`}
                                                value={exp.summary || ''}
                                                onChange={(e) => handleInputChange(e, index, 'summary')}
                                                className="w-full whitespace-normal"
                                                rows={5}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Job Description</Label>
                                            {exp.description.map((bullet: string, bulletIndex: number) => (
                                                <div key={bulletIndex} className="flex items-start gap-2 mt-2">
                                                    <Textarea
                                                        value={bullet}
                                                        onChange={(e) => handleBulletPointChange(index, bulletIndex, e.target.value)}
                                                        placeholder="Enter an achievement/responsibility"
                                                        className="w-full whitespace-normal break-words resize-none h-10 leading-tight"
                                                        rows={1}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-500 border-red-500 hover:text-red-700 hover:border-red-700 mt-1.5"
                                                        onClick={() => handleDeleteBulletPoint(index, bulletIndex)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                onClick={() => handleAddBulletPoint(index)}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                            >
                                                Add Achievement/Responsibility
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={handleAddEntry} variant="outline" className="mt-2">
                                Add Work Experience
                            </Button>
                        </div>
                    );

                case 'skills':
                    if (!Array.isArray(formData)) return <div>Loading...</div>;
                    return (
                        <div className="space-y-4">
                            {formData.map((skill: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={skill || ''}
                                        onChange={(e) => handleInputChange(e, index)}
                                        placeholder="Enter a skill"
                                        className="w-full whitespace-normal"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
                                        onClick={() => handleDeleteEntry(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    {errors[index] && <p className="text-red-500 text-sm mt-1">{errors[index]}</p>}
                                </div>
                            ))}
                            <Button onClick={handleAddEntry} variant="outline" className="mt-2">
                                Add Skill
                            </Button>
                        </div>
                    );

                case 'employment':
                    return (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="authorizedToWork">
                                    Are you authorized to work in the US? <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => handleSelectChange(value, 'authorizedToWork')}
                                    value={formData.authorizedToWork || ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.authorizedToWork && <p className="text-red-500 text-sm mt-1">{errors.authorizedToWork}</p>}
                            </div>
                            <div>
                                <Label htmlFor="disability">
                                    Do you have a disability? <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => handleSelectChange(value, 'disability')}
                                    value={formData.disability || ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.disability && <p className="text-red-500 text-sm mt-1">{errors.disability}</p>}
                            </div>
                            <div>
                                <Label htmlFor="gender">
                                    What is your gender? <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => handleSelectChange(value, 'gender')}
                                    value={formData.gender || ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </div>
                            <div>
                                <Label htmlFor="race">
                                    How would you identify your race? <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => handleSelectChange(value, 'race')}
                                    value={formData.race || ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Asian">Asian</SelectItem>
                                        <SelectItem value="Black or African American">Black or African American</SelectItem>
                                        <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                                        <SelectItem value="White">White</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.race && <p className="text-red-500 text-sm mt-1">{errors.race}</p>}
                            </div>
                        </div>
                    );

                default:
                    return null;
            }
        } catch (error) {
            console.error('Error rendering form:', error);
            return <div className="text-red-500">An error occurred while rendering the form. Please try again.</div>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`${getModalSize()} h-[80vh] flex flex-col p-0`}>
                <DialogHeader className="sticky top-0 bg-background pt-6 px-6 pb-4">
                    <DialogTitle>Edit {section?.charAt(0).toUpperCase() + section?.slice(1)} Section</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6">
                    {renderForm()}
                </div>
                <DialogFooter className="sticky bottom-0 bg-background px-6 py-2 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditModal;