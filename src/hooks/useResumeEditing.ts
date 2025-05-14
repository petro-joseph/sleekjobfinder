
import { useState } from 'react';
import { Resume } from '@/types/resume';

const useResumeEditing = (
    tailoredResume: Resume,
    setTailoredResume: React.Dispatch<React.SetStateAction<Resume | null>>
) => {
    const [editing, setEditing] = useState<{
        section: 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'additionalSkills' | 'softSkills' | null;
        index?: number;
    }>({ section: null });

    const [editValues, setEditValues] = useState<{
        summary?: string;
        skills?: string[];
        experience?: { index: number; responsibilities: string[] };
        education?: { index: number; institution?: string; degree?: string; startDate?: string; endDate?: string };
        project?: { index: number; title?: string; date?: string; description?: string };
        certifications?: Array<{ name: string; dateRange: string }>;
        projects?: Array<{
            title: string;
            date: string;
            description: string;
            role?: string;
            impact?: string;
            technologies?: string[];
        }>;
        additionalSkills?: string[];
        softSkills?: Array<{ name: string; description: string }>;
    }>({});

    const startEditing = (
        section: 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'additionalSkills' | 'softSkills',
        index?: number
    ) => {
        setEditing({ section, index });
        if (section === 'summary') {
            setEditValues({ summary: tailoredResume.summary });
        } else if (section === 'skills') {
            setEditValues({ skills: [...tailoredResume.skills] });
        } else if (section === 'experience' && typeof index === 'number') {
            setEditValues({
                experience: {
                    index,
                    responsibilities: [...tailoredResume.workExperiences[index].responsibilities],
                },
            });
        } else if (section === 'education' && typeof index === 'number') {
            const edu = tailoredResume.education[index];
            setEditValues({
                education: {
                    index,
                    institution: edu.institution,
                    degree: edu.degree,
                    startDate: edu.startDate,
                    endDate: edu.endDate,
                },
            });
        } else if (section === 'projects') {
            setEditValues({
                projects: tailoredResume.projects ? [...tailoredResume.projects] : [],
            });
        } else if (section === 'certifications') {
            setEditValues({ 
                certifications: tailoredResume.certifications ? [...tailoredResume.certifications] : [] 
            });
        } else if (section === 'additionalSkills') {
            setEditValues({ 
                additionalSkills: tailoredResume.additionalSkills ? [...tailoredResume.additionalSkills] : [] 
            });
        } else if (section === 'softSkills') {
            setEditValues({ 
                softSkills: tailoredResume.softSkills ? [...tailoredResume.softSkills] : [] 
            });
        }
    };

    const cancelEditing = () => {
        setEditing({ section: null });
        setEditValues({});
    };

    const saveEdits = () => {
        const updated = { ...tailoredResume };
        if (editing.section === 'summary' && editValues.summary !== undefined) {
            updated.summary = editValues.summary;
        } else if (editing.section === 'skills' && editValues.skills) {
            updated.skills = editValues.skills;
        } else if (editing.section === 'experience' && editValues.experience && typeof editing.index === 'number') {
            updated.workExperiences[editing.index].responsibilities = editValues.experience.responsibilities;
        } else if (editing.section === 'education' && editValues.education && typeof editing.index === 'number') {
            const edu = editValues.education;
            if (edu.institution) updated.education[editing.index].institution = edu.institution;
            if (edu.degree) updated.education[editing.index].degree = edu.degree;
            if (edu.startDate) updated.education[editing.index].startDate = edu.startDate;
            if (edu.endDate) updated.education[editing.index].endDate = edu.endDate;
        } else if (editing.section === 'projects' && editValues.projects) {
            updated.projects = editValues.projects;
        } else if (editing.section === 'certifications' && editValues.certifications) {
            updated.certifications = editValues.certifications;
        } else if (editing.section === 'additionalSkills' && editValues.additionalSkills) {
            updated.additionalSkills = editValues.additionalSkills;
        } else if (editing.section === 'softSkills' && editValues.softSkills) {
            updated.softSkills = editValues.softSkills;
        }
        setTailoredResume(updated);
        setEditing({ section: null });
        setEditValues({});
    };

    const addSkill = (skill: string) => {
        if (editValues.skills && !editValues.skills.includes(skill)) {
            setEditValues({ ...editValues, skills: [...editValues.skills, skill] });
        }
    };

    const removeSkill = (skill: string) => {
        if (editValues.skills) {
            setEditValues({ ...editValues, skills: editValues.skills.filter(s => s !== skill) });
        }
    };

    const addAdditionalSkill = (skill: string) => {
        if (editValues.additionalSkills && !editValues.additionalSkills.includes(skill)) {
            setEditValues({ ...editValues, additionalSkills: [...editValues.additionalSkills, skill] });
        }
    };

    const removeAdditionalSkill = (skill: string) => {
        if (editValues.additionalSkills) {
            setEditValues({ ...editValues, additionalSkills: editValues.additionalSkills.filter(s => s !== skill) });
        }
    };

    const updateResponsibility = (index: number, value: string) => {
        if (editValues.experience) {
            const updated = [...editValues.experience.responsibilities];
            updated[index] = value;
            setEditValues({
                ...editValues,
                experience: {
                    index: editValues.experience.index,
                    responsibilities: updated,
                },
            });
        }
    };

    const addResponsibility = () => {
        if (editValues.experience) {
            setEditValues({
                ...editValues,
                experience: {
                    index: editValues.experience.index,
                    responsibilities: [...editValues.experience.responsibilities, ''],
                },
            });
        }
    };

    const removeResponsibility = (index: number) => {
        if (editValues.experience) {
            const updated = editValues.experience.responsibilities.filter((_, i) => i !== index);
            setEditValues({
                ...editValues,
                experience: {
                    index: editValues.experience.index,
                    responsibilities: updated,
                },
            });
        }
    };

    return {
        editing,
        editValues,
        setEditValues,
        startEditing,
        cancelEditing,
        saveEdits,
        addSkill,
        removeSkill,
        addAdditionalSkill,
        removeAdditionalSkill,
        updateResponsibility,
        addResponsibility,
        removeResponsibility,
    };
};

export default useResumeEditing;
