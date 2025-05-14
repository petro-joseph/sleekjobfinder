import jsPDF from 'jspdf';
import { Resume } from '@/types/resume';

type ToastFunction = (props: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}) => void;

export const generatePDF = async (resume: Resume, toast: ToastFunction) => {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const fontSizes = {
            name: 20,
            contact: 10,
            heading: 12,
            subheading: 11,
            normal: 10,
            small: 9,
        };

        const margin = 15;
        let y = margin;
        const pageWidth = 210 - margin * 2;

        // Helper functions
        const addWrappedText = (
            text: string,
            x: number,
            y: number,
            maxWidth: number,
            fontSize: number,
            fontStyle: string = 'normal',
            align: 'left' | 'center' | 'right' = 'left'
        ) => {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', fontStyle);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y, { align });
            return y + lines.length * (fontSize / 3) + fontSize / 4;
        };

        const addHorizontalLine = (y: number) => {
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, y, 210 - margin, y);
            return y + 2;
        };

        const checkPageBreak = (currentY: number, neededSpace: number = 30) => {
            if (currentY > 275 - neededSpace) {
                doc.addPage();
                return margin;
            }
            return currentY;
        };

        // Name and contact info
        y = addWrappedText(resume.name, 105, y, pageWidth, fontSizes.name, 'bold', 'center');
        
        const contactInfoParts = [
            resume.contactInfo.phone,
            resume.contactInfo.email,
            resume.contactInfo.linkedin,
        ].filter(Boolean);
        
        // Handle long contact info for better mobile display
        let contactInfo = contactInfoParts.join(' | ');
        if (contactInfo.length > 65) { // If too long, split into two lines
            const midIndex = Math.floor(contactInfoParts.length / 2);
            const firstLine = contactInfoParts.slice(0, midIndex).join(' | ');
            const secondLine = contactInfoParts.slice(midIndex).join(' | ');
            
            y = addWrappedText(firstLine, 105, y + 2, pageWidth, fontSizes.contact, 'normal', 'center');
            y = addWrappedText(secondLine, 105, y + 2, pageWidth, fontSizes.contact, 'normal', 'center') + 5;
        } else {
            y = addWrappedText(contactInfo, 105, y + 2, pageWidth, fontSizes.contact, 'normal', 'center') + 5;
        }

        // Professional Summary section
        y = addHorizontalLine(y);
        y = addWrappedText('PROFESSIONAL SUMMARY', margin, y, pageWidth, fontSizes.heading, 'bold');
        y = addWrappedText(resume.summary, margin, y + 2, pageWidth, fontSizes.normal) + 5;

        // Skills section
        y = addHorizontalLine(y);
        y = addWrappedText('TECHNICAL AND BUSINESS SKILLS', margin, y, pageWidth, fontSizes.heading, 'bold');
        
        const skillCategories = {
            Technical: resume.skills.filter(skill =>
                ['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio'].includes(skill)
            ),
            Business: resume.skills.filter(skill =>
                ['Project Management', 'Process Improvement', 'Process Automation'].includes(skill)
            ),
            'Programming Languages': resume.skills.filter(skill =>
                ['PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle'].includes(skill)
            ),
            'Web Technologies': resume.skills.filter(skill =>
                ['DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS'].includes(skill)
            ),
            Languages: resume.skills.filter(skill => 
                ['Proficient in English and Swahili'].includes(skill)
            ),
            Other: resume.skills.filter(skill => 
                !['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio',
                  'Project Management', 'Process Improvement', 'Process Automation',
                  'PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle',
                  'DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS',
                  'Proficient in English and Swahili'].includes(skill)
            ),
        };
        
        Object.entries(skillCategories).forEach(([category, skills]) => {
            if (skills.length > 0) {
                y = checkPageBreak(y, 15);
                y = addWrappedText(`- ${category}: ${skills.join(', ')}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
                y += 2;
            }
        });
        y += 3;

        // Work Experience section
        y = addHorizontalLine(y);
        y = addWrappedText('PROFESSIONAL EXPERIENCES', margin, y, pageWidth, fontSizes.heading, 'bold');
        for (const experience of resume.workExperiences) {
            y = checkPageBreak(y, 25);
            y = addWrappedText(experience.title, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');
            
            const companyLine = `${experience.company} - ${experience.location}`;
            doc.setFontSize(fontSizes.small);
            doc.setFont('helvetica', 'normal');
            const companyWidth = doc.getTextWidth(companyLine);
            doc.text(companyLine, margin, y);
            
            const dateLine = `${experience.startDate} - ${experience.endDate || 'Present'}`;
            doc.setFont('helvetica', 'italic');
            doc.text(dateLine, 210 - margin, y, { align: 'right' });
            y += 4;
            
            experience.responsibilities.forEach((resp, index) => {
                y = checkPageBreak(y, 15);
                const bulletText = `${index + 1}. ${resp}`;
                y = addWrappedText(bulletText, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
            });
            
            // Handle sub-sections if present
            if (experience.subSections && experience.subSections.length > 0) {
                experience.subSections.forEach(subSection => {
                    y = checkPageBreak(y, 15);
                    y = addWrappedText(subSection.title, margin + 5, y + 2, pageWidth - 10, fontSizes.normal, 'bold');
                    
                    subSection.details.forEach((detail, detailIndex) => {
                        y = checkPageBreak(y, 10);
                        const bulletText = `• ${detail}`;
                        y = addWrappedText(bulletText, margin + 10, y + 1, pageWidth - 15, fontSizes.normal);
                    });
                });
            }
            
            y += 4;
        }

        // Education section
        y = checkPageBreak(y, 30);
        y = addHorizontalLine(y);
        y = addWrappedText('EDUCATION', margin, y, pageWidth, fontSizes.heading, 'bold');
        for (const education of resume.education) {
            y = checkPageBreak(y, 20);
            y = addWrappedText(education.degree, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');
            const eduLine = `${education.institution} (${education.startDate} - ${education.endDate})${education.gpa ? ` - Graduated with a ${education.gpa} GPA` : ''}`;
            y = addWrappedText(eduLine, margin, y + 1, pageWidth, fontSizes.small, 'italic') + 4;
        }

        // Certifications section (if applicable)
        if (resume.certifications && resume.certifications.length > 0) {
            y = checkPageBreak(y, 25);
            y = addHorizontalLine(y);
            y = addWrappedText('PROFESSIONAL CERTIFICATIONS', margin, y, pageWidth, fontSizes.heading, 'bold');
            resume.certifications.forEach((cert) => {
                y = checkPageBreak(y, 10);
                const certLine = `- ${cert.name} | ${cert.dateRange}`;
                y = addWrappedText(certLine, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
            });
            y += 4;
        }

        // Projects section (if applicable)
        if (resume.projects && resume.projects.length > 0) {
            y = checkPageBreak(y, 25);
            y = addHorizontalLine(y);
            y = addWrappedText('PROJECTS', margin, y, pageWidth, fontSizes.heading, 'bold');
            resume.projects.forEach(project => {
                addProject(project);
            });
        }

        // Additional Skills section (if applicable)
        if (resume.additionalSkills && resume.additionalSkills.length > 0) {
            y = checkPageBreak(y, 25);
            y = addHorizontalLine(y);
            y = addWrappedText('ADDITIONAL SKILLS', margin, y, pageWidth, fontSizes.heading, 'bold');
            
            // Create a multi-column layout for skills
            const skillsPerColumn = Math.ceil(resume.additionalSkills.length / 2);
            const columnWidth = (pageWidth - 10) / 2;
            
            for (let i = 0; i < skillsPerColumn; i++) {
                if (i < resume.additionalSkills.length) {
                    const skill = resume.additionalSkills[i];
                    y = checkPageBreak(y, 6);
                    addWrappedText(`• ${skill}`, margin + 5, y + 1, columnWidth, fontSizes.normal);
                }
                
                if (i + skillsPerColumn < resume.additionalSkills.length) {
                    const skill = resume.additionalSkills[i + skillsPerColumn];
                    addWrappedText(`• ${skill}`, margin + 5 + columnWidth + 5, y + 1, columnWidth, fontSizes.normal);
                }
                
                y += 4;
            }
        }
        
        // Soft Skills section (if applicable)
        if (resume.softSkills && resume.softSkills.length > 0) {
            y = checkPageBreak(y, 25);
            y = addHorizontalLine(y);
            y = addWrappedText('SOFT SKILLS', margin, y, pageWidth, fontSizes.heading, 'bold');
            resume.softSkills.forEach(skill => {
                y = checkPageBreak(y, 12);
                y = addWrappedText(`- ${skill.name}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal, 'bold');
                if (skill.description) {
                    y = addWrappedText(skill.description, margin + 8, y + 1, pageWidth - 15, fontSizes.small);
                }
            });
        }

        // Save the PDF
        const fileName = resume.name.replace(/\s+/g, '_');
        doc.save(`${fileName}_Resume.pdf`);
        
        toast({
            title: 'PDF Downloaded',
            description: 'Your tailored resume PDF has been downloaded.',
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
            title: 'Download Failed',
            description: 'There was an error generating the PDF. Please try again.',
            variant: 'destructive',
        });
        throw error;
    }
};

const addProject = (project) => {
    y = checkPageBreak(y, 20);
    y = addWrappedText(project.title, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');
    if (project.date) {
        y = addWrappedText(project.date, margin, y + 1, pageWidth, fontSizes.small, 'italic');
    }
    if (project.role) {
        y = addWrappedText(`Role: ${project.role}`, margin, y + 1, pageWidth, fontSizes.small, 'italic');
    }
    y = addWrappedText(`- ${project.description}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal) + 4;
};
