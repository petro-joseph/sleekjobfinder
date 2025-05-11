import { useState } from 'react';
import { Resume } from '@/types/resume';

const useResumeEditing = (
    tailoredResume: Resume,
    setTailoredResume: React.Dispatch<React.SetStateAction<Resume | null>>
) => {
    const [editing, setEditing] = useState<{
        section: 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'additionalSkills' | null;
        index?: number;
    }>({ section: null });

    const [editValues, setEditValues] = useState<{
        summary?: string;
        skills?: string[];
        experience?: { index: number; responsibilities: string[] };
        education?: { index: number; institution?: string; degree?: string; startDate?: string; endDate?: string };
        project?: { index: number; title?: string; date?: string; description?: string };
        certification?: { index: number; name?: string; dateRange?: string };
        additionalSkills?: string[];
    }>({});

    const startEditing = (
        section: 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'additionalSkills',
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
        } else if (section === 'projects' && typeof index === 'number') {
            const proj = tailoredResume.projects[index];
            setEditValues({
                project: {
                    index,
                    title: proj.title,
                    date: proj.date,
                    description: proj.description,
                },
            });
        } else if (section === 'certifications' && typeof index === 'number') {
            const cert = tailoredResume.certifications[index];
            setEditValues({
                certification: {
                    index,
                    name: cert.name,
                    dateRange: cert.dateRange,
                },
            });
        } else if (section === 'additionalSkills') {
            setEditValues({ additionalSkills: [...tailoredResume.additionalSkills] });
        }
    };

    const cancelEditing = () => {
        setEditing({ section: null });
        setEditValues({});
    };

    const saveEdits = () => {
        const updated = { ...tailoredResume };
        if (editing.section === 'summary' && editValues.summary) {
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
        } else if (editing.section === 'projects' && editValues.project && typeof editing.index === 'number') {
            const proj = editValues.project;
            if (proj.title) updated.projects[editing.index].title = proj.title;
            if (proj.date) updated.projects[editing.index].date = proj.date;
            if (proj.description) updated.projects[editing.index].description = proj.description;
        } else if (editing.section === 'certifications' && editValues.certification && typeof editing.index === 'number') {
            const cert = editValues.certification;
            if (cert.name) updated.certifications[editing.index].name = cert.name;
            if (cert.dateRange) updated.certifications[editing.index].dateRange = cert.dateRange;
        } else if (editing.section === 'additionalSkills' && editValues.additionalSkills) {
            updated.additionalSkills = editValues.additionalSkills;
        }
        setTailoredResume(updated);
        setEditing({ section: null });
        setEditValues({});
    };

    const addSkill = (skill: string) => {
        if (editValues.skills && !editValues.skills.includes(skill)) {
            setEditValues({ skills: [...editValues.skills, skill] });
        }
    };

    const removeSkill = (skill: string) => {
        if (editValues.skills) {
            setEditValues({ skills: editValues.skills.filter(s => s !== skill) });
        }
    };

    const addAdditionalSkill = (skill: string) => {
        if (editValues.additionalSkills && !editValues.additionalSkills.includes(skill)) {
            setEditValues({ additionalSkills: [...editValues.additionalSkills, skill] });
        }
    };

    const removeAdditionalSkill = (skill: string) => {
        if (editValues.additionalSkills) {
            setEditValues({ additionalSkills: editValues.additionalSkills.filter(s => s !== skill) });
        }
    };

    const updateResponsibility = (index: number, value: string) => {
        if (editValues.experience) {
            const updated = [...editValues.experience.responsibilities];
            updated[index] = value;
            setEditValues({
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