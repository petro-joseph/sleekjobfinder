import React from 'react';
import { Resume } from '@/types/resume';

interface ResumeHeaderProps {
    resume: Resume;
    template: string;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ resume, template }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold">{resume.name}</h1>
        <div className={`flex flex-wrap justify-center gap-x-4 ${template === 'compact' ? 'mt-1' : 'mt-2'}`}>
            <a href={`tel:${resume.contactInfo.phone}`} className="text-primary hover:underline">
                {resume.contactInfo.phone} |
            </a>
            <a href={`mailto:${resume.contactInfo.email}`} className="text-primary hover:underline">
                {resume.contactInfo.email} |
            </a>
            <a href={`https://${resume.contactInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {resume.contactInfo.linkedin}
            </a>
        </div>
    </div>
);

export default ResumeHeader;