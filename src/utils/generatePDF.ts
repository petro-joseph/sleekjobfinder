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

        y = addWrappedText(resume.name, 105, y, pageWidth, fontSizes.name, 'bold', 'center');
        const contactInfo = [
            resume.contactInfo.phone,
            resume.contactInfo.email,
            resume.contactInfo.linkedin,
        ]
            .filter(Boolean)
            .join(' | ');
        y = addWrappedText(contactInfo, 105, y + 2, pageWidth, fontSizes.contact, 'normal', 'center') + 5;

        y = addHorizontalLine(y);
        y = addWrappedText('PROFESSIONAL SUMMARY', margin, y, pageWidth, fontSizes.heading, 'bold');
        y = addWrappedText(resume.summary, margin, y + 2, pageWidth, fontSizes.normal) + 5;

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
            Languages: resume.skills.filter(skill => ['Proficient in English and Swahili'].includes(skill)),
        };
        Object.entries(skillCategories).forEach(([category, skills]) => {
            if (skills.length > 0) {
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                y = addWrappedText(`- ${category}: ${skills.join(', ')}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
            }
        });
        y += 5;

        y = addHorizontalLine(y);
        y = addWrappedText('PROFESSIONAL EXPERIENCES', margin, y, pageWidth, fontSizes.heading, 'bold');
        for (const experience of resume.workExperiences) {
            if (y > 270) {
                doc.addPage();
                y = margin;
            }
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
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                const bulletText = `${index + 1}. ${resp}`;
                y = addWrappedText(bulletText, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
            });
            y += 4;
        }

        if (y > 250) {
            doc.addPage();
            y = margin;
        }
        y = addHorizontalLine(y);
        y = addWrappedText('EDUCATION', margin, y, pageWidth, fontSizes.heading, 'bold');
        for (const education of resume.education) {
            if (y > 270) {
                doc.addPage();
                y = margin;
            }
            y = addWrappedText(education.degree, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');
            const eduLine = `${education.institution} (${education.startDate} - ${education.endDate})${education.gpa ? ` - Graduated with a ${edu.gpa} GPA` : ''}`;
            y = addWrappedText(eduLine, margin, y + 1, pageWidth, fontSizes.small, 'italic') + 4;
        }

        if (resume.certifications && resume.certifications.length > 0) {
            if (y > 250) {
                doc.addPage();
                y = margin;
            }
            y = addHorizontalLine(y);
            y = addWrappedText('PROFESSIONAL CERTIFICATIONS', margin, y, pageWidth, fontSizes.heading, 'bold');
            resume.certifications.forEach((cert) => {
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                const certLine = `- ${cert.name} | ${cert.dateRange}`;
                y = addWrappedText(certLine, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
            });
            y += 4;
        }

        if (resume.projects && resume.projects.length > 0) {
            if (y > 250) {
                doc.addPage();
                y = margin;
            }
            y = addHorizontalLine(y);
            y = addWrappedText('PROJECTS', margin, y, pageWidth, fontSizes.heading, 'bold');
            resume.projects.forEach(project => {
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                y = addWrappedText(project.title, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');
                if (project.date) {
                    y = addWrappedText(project.date, margin, y + 1, pageWidth, fontSizes.small, 'italic');
                }
                y = addWrappedText(`- ${project.description}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal) + 4;
            });
        }

        if (resume.additionalSkills && resume.additionalSkills.length > 0) {
            if (y > 250) {
                doc.addPage();
                y = margin;
            }
            y = addHorizontalLine(y);
            y = addWrappedText('ADDITIONAL SKILLS', margin, y, pageWidth, fontSizes.heading, 'bold');
            resume.additionalSkills.forEach(skill => {
                if (y > 270) {
                    doc.addPage();
                    y = margin;
                }
                y = addWrappedText(`- ${skill}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
            });
        }

        doc.save(`${resume.name.replace(/\s+/g, '_')}_Resume.pdf`);
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
        throw error; // Re-throw to be caught by the caller
    }
};