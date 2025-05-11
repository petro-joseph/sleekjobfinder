import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { Resume } from '@/types/resume';

type ToastFunction = (props: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
}) => void;

export const generateDOCX = async (resume: Resume, toast: ToastFunction) => {
    try {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
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
                        }),
                        new Paragraph({
                            spacing: { after: 400 },
                            children: [
                                new TextRun({
                                    text: [
                                        resume.contactInfo.phone,
                                        resume.contactInfo.email,
                                        resume.contactInfo.linkedin,
                                    ]
                                        .filter(Boolean)
                                        .join(' | '),
                                    size: 20,
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({
                                    text: 'PROFESSIONAL SUMMARY',
                                    bold: true,
                                    size: 24,
                                    allCaps: true,
                                }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 300 },
                            children: [
                                new TextRun({
                                    text: resume.summary,
                                    size: 20,
                                }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({
                                    text: '____________________',
                                    size: 24,
                                }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({
                                    text: 'TECHNICAL AND BUSINESS SKILLS',
                                    bold: true,
                                    size: 24,
                                    allCaps: true,
                                }),
                            ],
                        }),
                        ...Object.entries({
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
                        }).flatMap(([category, skills]) =>
                            skills.length > 0
                                ? [
                                    new Paragraph({
                                        spacing: { after: 80 },
                                        children: [
                                            new TextRun({
                                                text: `- ${category}: ${skills.join(', ')}`,
                                                size: 20,
                                            }),
                                        ],
                                        indent: { left: 400 },
                                    }),
                                ]
                                : []
                        ),
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({
                                    text: '____________________',
                                    size: 24,
                                }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({
                                    text: 'PROFESSIONAL EXPERIENCES',
                                    bold: true,
                                    size: 24,
                                    allCaps: true,
                                }),
                            ],
                        }),
                        ...resume.workExperiences.flatMap(exp => [
                            new Paragraph({
                                spacing: { before: 200, after: 80 },
                                children: [
                                    new TextRun({
                                        text: exp.title,
                                        bold: true,
                                        size: 22,
                                    }),
                                ],
                            }),
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
                            }),
                            ...exp.responsibilities.map(
                                (resp, index) =>
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
                            ),
                        ]),
                        new Paragraph({
                            spacing: { before: 200, after: 100 },
                            children: [
                                new TextRun({
                                    text: '____________________',
                                    size: 24,
                                }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { before: 300, after: 100 },
                            children: [
                                new TextRun({
                                    text: 'EDUCATION',
                                    bold: true,
                                    size: 24,
                                    allCaps: true,
                                }),
                            ],
                        }),
                        ...resume.education.flatMap(edu => [
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
                            }),
                        ]),
                        ...(resume.certifications && resume.certifications.length > 0
                            ? [
                                new Paragraph({
                                    spacing: { before: 200, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: '____________________',
                                            size: 24,
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    spacing: { before: 300, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: 'PROFESSIONAL CERTIFICATIONS',
                                            bold: true,
                                            size: 24,
                                            allCaps: true,
                                        }),
                                    ],
                                }),
                                ...resume.certifications.flatMap(cert => [
                                    new Paragraph({
                                        spacing: { after: 80 },
                                        children: [
                                            new TextRun({
                                                text: `- ${cert.name} | ${cert.dateRange}`,
                                                size: 20,
                                            }),
                                        ],
                                        indent: { left: 400 },
                                    }),
                                ]),
                            ]
                            : []),
                        ...(resume.projects && resume.projects.length > 0
                            ? [
                                new Paragraph({
                                    spacing: { before: 200, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: '____________________',
                                            size: 24,
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    spacing: { before: 300, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: 'PROJECTS',
                                            bold: true,
                                            size: 24,
                                            allCaps: true,
                                        }),
                                    ],
                                }),
                                ...resume.projects.flatMap(proj => [
                                    new Paragraph({
                                        spacing: { before: 200, after: 80 },
                                        children: [
                                            new TextRun({
                                                text: proj.title,
                                                bold: true,
                                                size: 22,
                                            }),
                                        ],
                                    }),
                                    ...(proj.date
                                        ? [
                                            new Paragraph({
                                                spacing: { after: 100 },
                                                children: [
                                                    new TextRun({
                                                        text: proj.date,
                                                        italics: true,
                                                        size: 18,
                                                    }),
                                                ],
                                            }),
                                        ]
                                        : []),
                                    new Paragraph({
                                        spacing: { after: 200 },
                                        children: [
                                            new TextRun({
                                                text: `- ${proj.description}`,
                                                size: 20,
                                            }),
                                        ],
                                        indent: { left: 400 },
                                    }),
                                ]),
                            ]
                            : []),
                        ...(resume.additionalSkills && resume.additionalSkills.length > 0
                            ? [
                                new Paragraph({
                                    spacing: { before: 200, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: '____________________',
                                            size: 24,
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    spacing: { before: 300, after: 100 },
                                    children: [
                                        new TextRun({
                                            text: 'ADDITIONAL SKILLS',
                                            bold: true,
                                            size: 24,
                                            allCaps: true,
                                        }),
                                    ],
                                }),
                                ...resume.additionalSkills.map(
                                    skill =>
                                        new Paragraph({
                                            spacing: { after: 80 },
                                            children: [
                                                new TextRun({
                                                    text: `- ${skill}`,
                                                    size: 20,
                                                }),
                                            ],
                                            indent: { left: 400 },
                                        })
                                ),
                            ]
                            : []),
                    ],
                },
            ],
        });

        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, `${resume.name.replace(/\s+/g, '_')}_Resume.docx`);
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
        throw error; // Re-throw to be caught by the caller
    }
};