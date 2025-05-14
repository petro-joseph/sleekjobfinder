
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { Resume } from '@/types/resume';

type ToastFunction = (props: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}) => void;

export const generateDOCX = async (resume: Resume, toast: ToastFunction) => {
    try {
        // Helper function to create section headings
        const createHeading = (text: string) => {
            return new Paragraph({
                spacing: { before: 300, after: 120 },
                heading: HeadingLevel.HEADING_2,
                children: [
                    new TextRun({
                        text: text.toUpperCase(),
                        bold: true,
                        size: 24,
                    }),
                ],
            });
        };

        // Create header with name and contact info
        const headerParagraphs = [
            new Paragraph({
                spacing: { after: 200 },
                children: [
                    new TextRun({
                        text: resume.name,
                        bold: true,
                        size: 40,
                    }),
                ],
                alignment: AlignmentType.CENTER,
            })
        ];

        // Split contact info if needed for better mobile display
        const contactParts = [
            resume.contactInfo.phone,
            resume.contactInfo.email,
            resume.contactInfo.linkedin,
        ].filter(Boolean);

        if (contactParts.join(' | ').length > 65) {
            // Split into two lines for better readability
            const midIndex = Math.ceil(contactParts.length / 2);
            const firstParts = contactParts.slice(0, midIndex);
            const secondParts = contactParts.slice(midIndex);

            headerParagraphs.push(
                new Paragraph({
                    spacing: { after: 120 },
                    children: [
                        new TextRun({
                            text: firstParts.join(' | '),
                            size: 20,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    spacing: { after: 400 },
                    children: [
                        new TextRun({
                            text: secondParts.join(' | '),
                            size: 20,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                })
            );
        } else {
            headerParagraphs.push(
                new Paragraph({
                    spacing: { after: 400 },
                    children: [
                        new TextRun({
                            text: contactParts.join(' | '),
                            size: 20,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                })
            );
        }

        // Divider
        const divider = new Paragraph({
            children: [
                new TextRun({
                    text: '____________________',
                    size: 24,
                }),
            ],
        });

        // Professional Summary section
        const summaryParagraphs = [
            createHeading('Professional Summary'),
            new Paragraph({
                spacing: { after: 300 },
                children: [
                    new TextRun({
                        text: resume.summary,
                        size: 20,
                    }),
                ],
            }),
            divider
        ];

        // Skills section
        const skillParagraphs = [
            createHeading('Technical and Business Skills')
        ];

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
                skillParagraphs.push(
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [
                            new TextRun({
                                text: `- ${category}: ${skills.join(', ')}`,
                                size: 20,
                            }),
                        ],
                        indent: { left: 400 },
                    })
                );
            }
        });

        skillParagraphs.push(divider);

        // Work Experience section
        const experienceParagraphs = [
            createHeading('Professional Experiences')
        ];

        resume.workExperiences.forEach(exp => {
            // Title
            experienceParagraphs.push(
                new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                        new TextRun({
                            text: exp.title,
                            bold: true,
                            size: 22,
                        }),
                    ],
                })
            );

            // Company and date
            experienceParagraphs.push(
                new Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new TextRun({
                            text: `${exp.company} - ${exp.location}`,
                            size: 18,
                        }),
                        new TextRun({
                            text: `\t${exp.startDate} - ${exp.endDate || 'Present'}`,
                            size: 18,
                            italics: true,
                        }),
                    ],
                })
            );

            // Responsibilities
            exp.responsibilities.forEach((resp, index) => {
                experienceParagraphs.push(
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [
                            new TextRun({
                                text: `${index + 1}. ${resp}`,
                                size: 20,
                            }),
                        ],
                        indent: { left: 400 },
                    })
                );
            });

            // Sub-sections if any
            if (exp.subSections && exp.subSections.length > 0) {
                exp.subSections.forEach(subSection => {
                    if (subSection.title) {
                        experienceParagraphs.push(
                            new Paragraph({
                                spacing: { before: 100, after: 80 },
                                children: [
                                    new TextRun({
                                        text: subSection.title,
                                        bold: true,
                                        size: 20,
                                    }),
                                ],
                                indent: { left: 400 },
                            })
                        );
                    }

                    subSection.details.forEach((detail, detailIndex) => {
                        experienceParagraphs.push(
                            new Paragraph({
                                spacing: { after: 80 },
                                children: [
                                    new TextRun({
                                        text: `• ${detail}`,
                                        size: 20,
                                    }),
                                ],
                                indent: { left: 500 },
                            })
                        );
                    });
                });
            }
        });

        experienceParagraphs.push(divider);

        // Education section
        const educationParagraphs = [
            createHeading('Education')
        ];

        resume.education.forEach(edu => {
            educationParagraphs.push(
                new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                        new TextRun({
                            text: edu.degree,
                            bold: true,
                            size: 22,
                        }),
                    ],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: `${edu.institution} (${edu.startDate} - ${edu.endDate})${edu.gpa ? ` - Graduated with a ${edu.gpa} GPA` : ''}`,
                            italics: true,
                            size: 18,
                        }),
                    ],
                })
            );
        });

        // Build array of sections to include
        const sections = [...headerParagraphs, ...summaryParagraphs, ...skillParagraphs, ...experienceParagraphs, ...educationParagraphs];

        // Certifications section (if applicable)
        if (resume.certifications && resume.certifications.length > 0) {
            sections.push(divider);
            sections.push(createHeading('Professional Certifications'));
            
            resume.certifications.forEach(cert => {
                sections.push(
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [
                            new TextRun({
                                text: `- ${cert.name} | ${cert.dateRange}`,
                                size: 20,
                            }),
                        ],
                        indent: { left: 400 },
                    })
                );
            });
        }

        // Projects section (if applicable)
        if (resume.projects && resume.projects.length > 0) {
            sections.push(divider);
            sections.push(createHeading('Projects'));
            
            resume.projects.forEach(proj => {
                sections.push(
                    new Paragraph({
                        spacing: { before: 200, after: 80 },
                        children: [
                            new TextRun({
                                text: proj.title,
                                bold: true,
                                size: 22,
                            }),
                        ],
                    })
                );
                
                if (proj.date) {
                    sections.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [
                                new TextRun({
                                    text: proj.date,
                                    italics: true,
                                    size: 18,
                                }),
                            ],
                        })
                    );
                }
                
                if (proj.role) {
                    sections.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [
                                new TextRun({
                                    text: `Role: ${proj.role}`,
                                    italics: true,
                                    size: 18,
                                }),
                            ],
                        })
                    );
                }
                
                sections.push(
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [
                            new TextRun({
                                text: `- ${proj.description}`,
                                size: 20,
                            }),
                        ],
                        indent: { left: 400 },
                    })
                );
            });
        }

        // Additional Skills section (if applicable)
        if (resume.additionalSkills && resume.additionalSkills.length > 0) {
            sections.push(divider);
            sections.push(createHeading('Additional Skills'));

            // Create a table for multi-column layout
            if (resume.additionalSkills.length > 5) {
                // Create a 2-column table for skills
                const rows = [];
                const midPoint = Math.ceil(resume.additionalSkills.length / 2);
                
                for (let i = 0; i < midPoint; i++) {
                    const row = new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `• ${resume.additionalSkills[i]}`,
                                                size: 20,
                                            }),
                                        ],
                                    }),
                                ],
                                borders: {
                                    top: { style: BorderStyle.NONE },
                                    bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE },
                                    right: { style: BorderStyle.NONE },
                                },
                            }),
                            new TableCell({
                                children: [
                                    i + midPoint < resume.additionalSkills.length
                                        ? new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `• ${resume.additionalSkills[i + midPoint]}`,
                                                    size: 20,
                                                }),
                                            ],
                                        })
                                        : new Paragraph({}),
                                ],
                                borders: {
                                    top: { style: BorderStyle.NONE },
                                    bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE },
                                    right: { style: BorderStyle.NONE },
                                },
                            }),
                        ],
                    });
                    rows.push(row);
                }
                
                sections.push(
                    new Table({
                        rows,
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                    })
                );
            } else {
                // Just use paragraphs for a small number of skills
                resume.additionalSkills.forEach(skill => {
                    sections.push(
                        new Paragraph({
                            spacing: { after: 80 },
                            children: [
                                new TextRun({
                                    text: `• ${skill}`,
                                    size: 20,
                                }),
                            ],
                            indent: { left: 400 },
                        })
                    );
                });
            }
        }

        // Soft Skills section (if applicable)
        if (resume.softSkills && resume.softSkills.length > 0) {
            sections.push(divider);
            sections.push(createHeading('Soft Skills'));
            
            resume.softSkills.forEach(skill => {
                sections.push(
                    new Paragraph({
                        spacing: { after: 40 },
                        children: [
                            new TextRun({
                                text: `• ${skill.name}`,
                                bold: true,
                                size: 20,
                            }),
                        ],
                        indent: { left: 400 },
                    })
                );
                
                if (skill.description) {
                    sections.push(
                        new Paragraph({
                            spacing: { after: 100 },
                            children: [
                                new TextRun({
                                    text: skill.description,
                                    size: 18,
                                }),
                            ],
                            indent: { left: 500 },
                        })
                    );
                }
            });
        }

        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 800,
                                right: 800,
                                bottom: 800,
                                left: 800,
                            },
                        },
                    },
                    children: sections,
                },
            ],
        });

        const buffer = await Packer.toBlob(doc);
        const fileName = resume.name.replace(/\s+/g, '_');
        saveAs(buffer, `${fileName}_Resume.docx`);
        
        toast({
            title: 'DOCX Downloaded',
            description: 'Your tailored resume DOCX has been downloaded.',
        });
    } catch (error) {
        console.error('Error generating DOCX:', error);
        toast({
            title: 'Download Failed',
            description: 'There was an error generating the DOCX file. Please try again.',
            variant: 'destructive',
        });
        throw error;
    }
};
