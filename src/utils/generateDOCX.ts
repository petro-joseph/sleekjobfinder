
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
    ParagraphChild,
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
        const doc = new Document();
        
        // Function to add a heading
        const addHeading = (text: string, level: HeadingLevel) => {
            const paragraph = new Paragraph({
                heading: level,
                children: [new TextRun(text)]
            });
            doc.addParagraph(paragraph);
        };

        // Function to add a paragraph
        const addParagraph = (text: string, options: any = {}) => {
            const paragraph = new Paragraph({
                children: [new TextRun({ text, ...options })],
                alignment: options.alignment,
                bullet: options.bullet ? { level: 0 } : undefined,
            });
            doc.addParagraph(paragraph);
        };

        // Function to add bullet points
        const addBulletPoint = (text: string) => {
            const paragraph = new Paragraph({
                children: [new TextRun(text)],
                bullet: { level: 0 },
            });
            doc.addParagraph(paragraph);
        };

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

        // Name and contact information
        addHeading(resume.name, HeadingLevel.TITLE);
        addParagraph(`${resume.contactInfo.phone} | ${resume.contactInfo.email} | ${resume.contactInfo.linkedin}`, {
            alignment: AlignmentType.CENTER,
        });

        // Professional Summary
        addHeading('PROFESSIONAL SUMMARY', HeadingLevel.HEADING_1);
        addParagraph(resume.summary);

        // Skills section
        addHeading('TECHNICAL AND BUSINESS SKILLS', HeadingLevel.HEADING_1);
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
                addParagraph(`- ${category}: ${skills.join(', ')}`);
            }
        });

        // Work Experience
        addHeading('PROFESSIONAL EXPERIENCES', HeadingLevel.HEADING_1);
        resume.workExperiences.forEach(experience => {
            addParagraph(experience.title, { bold: true });
            addParagraph(`${experience.company} - ${experience.location}`, { italic: true });
            addParagraph(`${experience.startDate} - ${experience.endDate || 'Present'}`);
            experience.responsibilities.forEach(responsibility => {
                addBulletPoint(responsibility);
            });

            // Subsections
            if (experience.subSections && experience.subSections.length > 0) {
                experience.subSections.forEach(subSection => {
                    addParagraph(subSection.title, { bold: true });
                    subSection.details.forEach(detail => {
                        addBulletPoint(detail);
                    });
                });
            }
        });

        // Education
        addHeading('EDUCATION', HeadingLevel.HEADING_1);
        resume.education.forEach(education => {
            addParagraph(education.degree, { bold: true });
            addParagraph(`${education.institution} (${education.startDate} - ${education.endDate})${education.gpa ? ` - Graduated with a ${education.gpa} GPA` : ''}`, { italic: true });
        });

        // Certifications
        if (resume.certifications && resume.certifications.length > 0) {
            addHeading('PROFESSIONAL CERTIFICATIONS', HeadingLevel.HEADING_1);
            resume.certifications.forEach(cert => {
                addBulletPoint(`${cert.name} | ${cert.dateRange}`);
            });
        }

        // Update the project section to access role property correctly
        if (resume.projects && resume.projects.length > 0) {
            addHeading('PROJECTS', HeadingLevel.HEADING_1);
            resume.projects.forEach(project => {
                addParagraph(project.title, { bold: true });
                
                if (project.date) {
                    addParagraph(project.date, { italic: true });
                }
                
                if (project.role) {
                    addParagraph(`Role: ${project.role}`, { italic: true });
                }
                
                // Add the description as a bullet point
                addBulletPoint(project.description);
            });
        }

        // Additional Skills
        if (resume.additionalSkills && resume.additionalSkills.length > 0) {
            addHeading('ADDITIONAL SKILLS', HeadingLevel.HEADING_1);
            const skillsTable = createSkillsTable(resume.additionalSkills);
            doc.addTable(skillsTable);
        }

        // Soft Skills
        if (resume.softSkills && resume.softSkills.length > 0) {
            addHeading('SOFT SKILLS', HeadingLevel.HEADING_1);
            resume.softSkills.forEach(skill => {
                addParagraph(skill.name, { bold: true });
                addParagraph(skill.description);
            });
        }

        // Create the blob and trigger the download
        const blob = await doc.save();
        saveAs(blob, `${resume.name.replace(/\s+/g, '_')}_Resume.docx`);

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
