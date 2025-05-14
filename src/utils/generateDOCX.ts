
import {
    Document,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeadingLevel,
    TextRun,
    AlignmentType,
    Packer
} from "docx";
import { saveAs } from "file-saver";
import { Resume } from '@/types/resume';

type ToastFunction = (props: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}) => void;

export const generateDOCX = async (resume: Resume, toast: ToastFunction) => {
    try {
        // Create an array to collect all content
        const content: (Paragraph | Table)[] = [];
        
        // Create helper functions to add content
        const addHeading = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]) => {
            return new Paragraph({
                heading: level,
                children: [new TextRun(text)]
            });
        };

        const addParagraph = (text: string, options: any = {}) => {
            return new Paragraph({
                children: [new TextRun({ text, ...options })],
                alignment: options.alignment,
                bullet: options.bullet ? { level: 0 } : undefined,
            });
        };

        const addBulletPoint = (text: string) => {
            return new Paragraph({
                children: [new TextRun(text)],
                bullet: { level: 0 },
            });
        };

        // Name and contact information
        content.push(addHeading(resume.name, HeadingLevel.TITLE));
        content.push(addParagraph(`${resume.contactInfo.phone} | ${resume.contactInfo.email} | ${resume.contactInfo.linkedin}`, {
            alignment: AlignmentType.CENTER,
        }));

        // Professional Summary
        content.push(addHeading('PROFESSIONAL SUMMARY', HeadingLevel.HEADING_1));
        content.push(addParagraph(resume.summary));

        // Skills section
        content.push(addHeading('TECHNICAL AND BUSINESS SKILLS', HeadingLevel.HEADING_1));
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
                content.push(addParagraph(`- ${category}: ${skills.join(', ')}`));
            }
        });

        // Work Experience
        content.push(addHeading('PROFESSIONAL EXPERIENCES', HeadingLevel.HEADING_1));
        resume.workExperiences.forEach(experience => {
            content.push(addParagraph(experience.title, { bold: true }));
            content.push(addParagraph(`${experience.company} - ${experience.location}`, { italic: true }));
            content.push(addParagraph(`${experience.startDate} - ${experience.endDate || 'Present'}`));
            
            experience.responsibilities.forEach(responsibility => {
                content.push(addBulletPoint(responsibility));
            });

            // Subsections
            if (experience.subSections && experience.subSections.length > 0) {
                experience.subSections.forEach(subSection => {
                    content.push(addParagraph(subSection.title, { bold: true }));
                    subSection.details.forEach(detail => {
                        content.push(addBulletPoint(detail));
                    });
                });
            }
        });

        // Education
        content.push(addHeading('EDUCATION', HeadingLevel.HEADING_1));
        resume.education.forEach(education => {
            content.push(addParagraph(education.degree, { bold: true }));
            content.push(addParagraph(`${education.institution} (${education.startDate} - ${education.endDate})${education.gpa ? ` - Graduated with a ${education.gpa} GPA` : ''}`, { italic: true }));
        });

        // Certifications
        if (resume.certifications && resume.certifications.length > 0) {
            content.push(addHeading('PROFESSIONAL CERTIFICATIONS', HeadingLevel.HEADING_1));
            resume.certifications.forEach(cert => {
                content.push(addBulletPoint(`${cert.name} | ${cert.dateRange}`));
            });
        }

        // Projects
        if (resume.projects && resume.projects.length > 0) {
            content.push(addHeading('PROJECTS', HeadingLevel.HEADING_1));
            resume.projects.forEach(project => {
                content.push(addParagraph(project.title, { bold: true }));
                
                if (project.date) {
                    content.push(addParagraph(project.date, { italic: true }));
                }
                
                if (project.role) {
                    content.push(addParagraph(`Role: ${project.role}`, { italic: true }));
                }
                
                // Add the description as a bullet point
                content.push(addBulletPoint(project.description));
            });
        }

        // Function to create a table for skills
        const createSkillsTable = (skills: string[]): Table => {
            const numColumns = 3;
            const rows: TableRow[] = [];
            
            // Calculate how many rows we need
            const numRows = Math.ceil(skills.length / numColumns);
            
            // Create each row
            for (let row = 0; row < numRows; row++) {
                const cells: TableCell[] = [];
                
                // Create cells for this row
                for (let col = 0; col < numColumns; col++) {
                    const index = row * numColumns + col;
                    if (index < skills.length) {
                        cells.push(
                            new TableCell({
                                children: [new Paragraph({
                                    children: [new TextRun(skills[index])]
                                })],
                                width: { size: 100 / numColumns, type: WidthType.PERCENTAGE },
                            })
                        );
                    } else {
                        // Empty cell for padding
                        cells.push(
                            new TableCell({
                                children: [new Paragraph({
                                    children: [new TextRun("")]
                                })],
                                width: { size: 100 / numColumns, type: WidthType.PERCENTAGE },
                            })
                        );
                    }
                }
                
                rows.push(new TableRow({ children: cells }));
            }

            return new Table({
                rows: rows,
                width: { size: 100, type: WidthType.PERCENTAGE },
            });
        };

        // Additional Skills as a table
        if (resume.additionalSkills && resume.additionalSkills.length > 0) {
            content.push(addHeading('ADDITIONAL SKILLS', HeadingLevel.HEADING_1));
            content.push(createSkillsTable(resume.additionalSkills));
        }

        // Soft Skills
        if (resume.softSkills && resume.softSkills.length > 0) {
            content.push(addHeading('SOFT SKILLS', HeadingLevel.HEADING_1));
            resume.softSkills.forEach(skill => {
                content.push(addParagraph(skill.name, { bold: true }));
                content.push(addParagraph(skill.description));
            });
        }

        // Create document and add the content properly
        const doc = new Document({
            sections: [{
                children: content
            }]
        });

        // Generate and download the document
        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, `${resume.name.replace(/\s+/g, '_')}_Resume.docx`);

        toast({
            title: 'DOCX Downloaded',
            description: 'Your tailored resume DOCX has been downloaded.',
        });

    } catch (error) {
        console.error("Error generating DOCX:", error);
        toast({
            title: 'Download Failed',
            description: 'There was an error generating the DOCX. Please try again.',
            variant: 'destructive',
        });
        throw error;
    }
};
