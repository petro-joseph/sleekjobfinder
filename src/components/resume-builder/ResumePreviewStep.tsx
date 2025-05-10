import React, { useState } from 'react';
import { Check, Download, Edit, Save, X, ThumbsUp, ThumbsDown, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Resume, MatchData } from '@/types/resume';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface ResumePreviewStepProps {
  originalResume: Resume;
  tailoredResume: Resume;
  setTailoredResume: React.Dispatch<React.SetStateAction<Resume | null>>;
  matchData: MatchData;
  selectedSkills: string[];
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
  onFeedback: (positive: boolean) => void;
  credits: number;
}

export const ResumePreviewStep: React.FC<ResumePreviewStepProps> = ({
  originalResume,
  tailoredResume,
  setTailoredResume,
  matchData,
  selectedSkills,
  template,
  setTemplate,
  onFeedback,
  credits
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const [editing, setEditing] = useState<{
    section: 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'additionalSkills' | null;
    index?: number;
  }>({ section: null });

  const [editValues, setEditValues] = useState<{
    summary?: string;
    skills?: string[];
    experience?: {
      index: number;
      responsibilities: string[];
    };
    education?: {
      index: number;
      institution?: string;
      degree?: string;
      startDate?: string;
      endDate?: string;
    };
    project?: {
      index: number;
      title?: string;
      date?: string;
      description?: string;
    };
    certification?: {
      index: number;
      name?: string;
      dateRange?: string;
    };
    additionalSkills?: string[];
  }>({});

  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const startEditing = (section: 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'additionalSkills', index?: number) => {
    setEditing({ section, index });

    if (section === 'summary') {
      setEditValues({ summary: tailoredResume.summary });
    } else if (section === 'skills') {
      setEditValues({ skills: [...tailoredResume.skills] });
    } else if (section === 'experience' && typeof index === 'number') {
      setEditValues({
        experience: {
          index,
          responsibilities: [...tailoredResume.workExperiences[index].responsibilities]
        }
      });
    } else if (section === 'education' && typeof index === 'number') {
      const edu = tailoredResume.education[index];
      setEditValues({
        education: {
          index,
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate
        }
      });
    } else if (section === 'projects' && typeof index === 'number') {
      const proj = tailoredResume.projects[index];
      setEditValues({
        project: {
          index,
          title: proj.title,
          date: proj.date,
          description: proj.description
        }
      });
    } else if (section === 'certifications' && typeof index === 'number') {
      const cert = tailoredResume.certifications[index];
      setEditValues({
        certification: {
          index,
          name: cert.name,
          dateRange: cert.dateRange
        }
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
          responsibilities: updated
        }
      });
    }
  };

  const addResponsibility = () => {
    if (editValues.experience) {
      setEditValues({
        experience: {
          index: editValues.experience.index,
          responsibilities: [...editValues.experience.responsibilities, '']
        }
      });
    }
  };

  const removeResponsibility = (index: number) => {
    if (editValues.experience) {
      const updated = editValues.experience.responsibilities.filter((_, i) => i !== index);
      setEditValues({
        experience: {
          index: editValues.experience.index,
          responsibilities: updated
        }
      });
    }
  };

  const getScoreLabel = (score: number) => {
    if (score < 5) return "Poor";
    if (score < 7) return "Fair";
    return "Good";
  };

  const getScoreColor = (score: number) => {
    if (score < 5) return "text-red-500";
    if (score < 7) return "text-yellow-500";
    return "text-green-500";
  };

  const getGaugeStyle = (score: number) => {
    const percentage = (score / 10) * 100;
    let color;
    if (score < 5) color = '#ef4444';
    else if (score < 7) color = '#f59e0b';
    else color = '#22c55e';

    return {
      background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}% 100%)`,
    };
  };

  const generatePDF = async () => {
    try {
      setIsDownloading(true);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const fontSizes = {
        name: 20,
        contact: 10,
        heading: 12,
        subheading: 11,
        normal: 10,
        small: 9
      };

      const margin = 15;
      let y = margin;
      const pageWidth = 210 - (margin * 2);

      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, fontStyle: string = 'normal', align: string = 'left') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y, { align });
        return y + (lines.length * (fontSize / 3)) + (fontSize / 4);
      };

      const addHorizontalLine = (y: number) => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, 210 - margin, y);
        return y + 2;
      };

      // Name (centered)
      y = addWrappedText(tailoredResume.name, 105, y, pageWidth, fontSizes.name, 'bold', 'center');

      // Contact Info (centered)
      const contactInfo = [
        tailoredResume.contactInfo.phone,
        tailoredResume.contactInfo.email,
        tailoredResume.contactInfo.linkedin
      ].filter(Boolean).join(' | ');
      y = addWrappedText(contactInfo, 105, y + 2, pageWidth, fontSizes.contact, 'normal', 'center') + 5;

      // Professional Summary
      y = addHorizontalLine(y);
      y = addWrappedText('PROFESSIONAL SUMMARY', margin, y, pageWidth, fontSizes.heading, 'bold');
      y = addWrappedText(tailoredResume.summary, margin, y + 2, pageWidth, fontSizes.normal) + 5;

      // Technical and Business Skills
      y = addHorizontalLine(y);
      y = addWrappedText('TECHNICAL AND BUSINESS SKILLS', margin, y, pageWidth, fontSizes.heading, 'bold');
      const skillCategories = {
        Technical: tailoredResume.skills.filter(skill => ['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio'].includes(skill)),
        Business: tailoredResume.skills.filter(skill => ['Project Management', 'Process Improvement', 'Process Automation'].includes(skill)),
        'Programming Languages': tailoredResume.skills.filter(skill => ['PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle'].includes(skill)),
        'Web Technologies': tailoredResume.skills.filter(skill => ['DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS'].includes(skill)),
        Languages: tailoredResume.skills.filter(skill => ['Proficient in English and Swahili'].includes(skill))
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

      // Professional Experiences
      y = addHorizontalLine(y);
      y = addWrappedText('PROFESSIONAL EXPERIENCES', margin, y, pageWidth, fontSizes.heading, 'bold');
      for (const experience of tailoredResume.workExperiences) {
        if (y > 270) {
          doc.addPage();
          y = margin;
        }

        // Job Title (bold)
        y = addWrappedText(experience.title, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');

        // Company and Location (normal, left), Dates (italic, right)
        const companyLine = `${experience.company} - ${experience.location}`;
        doc.setFontSize(fontSizes.small);
        doc.setFont('helvetica', 'normal');
        const companyWidth = doc.getTextWidth(companyLine);
        doc.text(companyLine, margin, y);

        const dateLine = `${experience.startDate} - ${experience.endDate || 'Present'}`;
        doc.setFont('helvetica', 'italic');
        doc.text(dateLine, 210 - margin, y, { align: 'right' });
        y += 4;

        // Responsibilities (numbered)
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

      // Education
      if (y > 250) {
        doc.addPage();
        y = margin;
      }
      y = addHorizontalLine(y);
      y = addWrappedText('EDUCATION', margin, y, pageWidth, fontSizes.heading, 'bold');
      for (const education of tailoredResume.education) {
        if (y > 270) {
          doc.addPage();
          y = margin;
        }

        // Degree
        y = addWrappedText(education.degree, margin, y + 2, pageWidth, fontSizes.subheading, 'bold');

        // Institution and Dates (italic)
        const eduLine = `${education.institution} (${education.startDate} - ${education.endDate})${education.gpa ? ` - Graduated with a ${education.gpa} GPA` : ''}`;
        y = addWrappedText(eduLine, margin, y + 1, pageWidth, fontSizes.small, 'italic') + 4;
      }

      // Professional Certifications
      if (tailoredResume.certifications && tailoredResume.certifications.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }
        y = addHorizontalLine(y);
        y = addWrappedText('PROFESSIONAL CERTIFICATIONS', margin, y, pageWidth, fontSizes.heading, 'bold');
        tailoredResume.certifications.forEach((cert, index) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          const certLine = `- ${cert.name} | ${cert.dateRange}`;
          y = addWrappedText(certLine, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
        });
        y += 4;
      }

      // Projects
      if (tailoredResume.projects && tailoredResume.projects.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }
        y = addHorizontalLine(y);
        y = addWrappedText('PROJECTS', margin, y, pageWidth, fontSizes.heading, 'bold');
        tailoredResume.projects.forEach((project) => {
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

      // Additional Skills (at the bottom)
      if (tailoredResume.additionalSkills && tailoredResume.additionalSkills.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }
        y = addHorizontalLine(y);
        y = addWrappedText('ADDITIONAL SKILLS', margin, y, pageWidth, fontSizes.heading, 'bold');
        tailoredResume.additionalSkills.forEach((skill) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          y = addWrappedText(`- ${skill}`, margin + 5, y + 1, pageWidth - 10, fontSizes.normal);
        });
      }

      doc.save(`${tailoredResume.name.replace(/\s+/g, '_')}_Resume.pdf`);

      toast({
        title: "PDF Downloaded",
        description: "Your tailored resume PDF has been downloaded."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const generateDOCX = async () => {
    try {
      setIsDownloading(true);

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: tailoredResume.contactInfo.name,
                  bold: true,
                  size: 40,
                  alignment: 'center'
                })
              ],
              alignment: 'center'
            }),

            new Paragraph({
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text: [
                    tailoredResume.contactInfo.phone,
                    tailoredResume.contactInfo.email,
                    tailoredResume.contactInfo.linkedin
                  ].filter(Boolean).join(' | '),
                  size: 20,
                  alignment: 'center'
                })
              ],
              alignment: 'center'
            }),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: 'PROFESSIONAL SUMMARY',
                  bold: true,
                  size: 24,
                  allCaps: true
                })
              ]
            }),

            new Paragraph({
              spacing: { after: 300 },
              children: [
                new TextRun({
                  text: tailoredResume.summary,
                  size: 20
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: '____________________',
                  size: 24
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: 'TECHNICAL AND BUSINESS SKILLS',
                  bold: true,
                  size: 24,
                  allCaps: true
                })
              ]
            }),

            ...Object.entries({
              Technical: tailoredResume.skills.filter(skill => ['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio'].includes(skill)),
              Business: tailoredResume.skills.filter(skill => ['Project Management', 'Process Improvement', 'Process Automation'].includes(skill)),
              'Programming Languages': tailoredResume.skills.filter(skill => ['PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle'].includes(skill)),
              'Web Technologies': tailoredResume.skills.filter(skill => ['DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS'].includes(skill)),
              Languages: tailoredResume.skills.filter(skill => ['Proficient in English and Swahili'].includes(skill))
            }).flatMap(([category, skills]) => skills.length > 0 ? [
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: `- ${category}: ${skills.join(', ')}`,
                    size: 20
                  })
                ],
                indent: { left: 400 }
              })
            ] : []),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: '____________________',
                  size: 24
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: 'PROFESSIONAL EXPERIENCES',
                  bold: true,
                  size: 24,
                  allCaps: true
                })
              ]
            }),

            ...tailoredResume.workExperiences.flatMap(exp => [
              new Paragraph({
                spacing: { before: 200, after: 80 },
                children: [
                  new TextRun({
                    text: exp.title,
                    bold: true,
                    size: 22
                  })
                ]
              }),

              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: `${exp.company} - ${exp.location}`,
                    size: 18
                  }),
                  new TextRun({
                    text: `\t${exp.startDate} - ${exp.endDate || 'Present'}`,
                    size: 18,
                    italics: true,
                    alignment: 'right'
                  })
                ]
              }),

              ...exp.responsibilities.map((resp, index) =>
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: `${index + 1}. ${resp}`,
                      size: 20
                    })
                  ],
                  indent: { left: 400 }
                })
              )
            ]),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: '____________________',
                  size: 24
                })
              ]
            }),

            new Paragraph({
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'EDUCATION',
                  bold: true,
                  size: 24,
                  allCaps: true
                })
              ]
            }),

            ...tailoredResume.education.flatMap(edu => [
              new Paragraph({
                spacing: { before: 200, after: 80 },
                children: [
                  new TextRun({
                    text: edu.degree,
                    bold: true,
                    size: 22
                  })
                ]
              }),

              new Paragraph({
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: `${edu.institution} (${edu.startDate} - ${edu.endDate})${edu.gpa ? ` - Graduated with a ${edu.gpa} GPA` : ''}`,
                    italics: true,
                    size: 18
                  })
                ]
              })
            ]),

            ...(tailoredResume.certifications && tailoredResume.certifications.length > 0 ? [
              new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [
                  new TextRun({
                    text: '____________________',
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 300, after: 100 },
                children: [
                  new TextRun({
                    text: 'PROFESSIONAL CERTIFICATIONS',
                    bold: true,
                    size: 24,
                    allCaps: true
                  })
                ]
              }),

              ...tailoredResume.certifications.flatMap(cert => [
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: `- ${cert.name} | ${cert.dateRange}`,
                      size: 20
                    })
                  ],
                  indent: { left: 400 }
                })
              ])
            ] : []),

            ...(tailoredResume.projects && tailoredResume.projects.length > 0 ? [
              new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [
                  new TextRun({
                    text: '____________________',
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 300, after: 100 },
                children: [
                  new TextRun({
                    text: 'PROJECTS',
                    bold: true,
                    size: 24,
                    allCaps: true
                  })
                ]
              }),

              ...tailoredResume.projects.flatMap(proj => [
                new Paragraph({
                  spacing: { before: 200, after: 80 },
                  children: [
                    new TextRun({
                      text: proj.title,
                      bold: true,
                      size: 22
                    })
                  ]
                }),

                ...(proj.date ? [
                  new Paragraph({
                    spacing: { after: 100 },
                    children: [
                      new TextRun({
                        text: proj.date,
                        italics: true,
                        size: 18
                      })
                    ]
                  })
                ] : []),

                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new TextRun({
                      text: `- ${proj.description}`,
                      size: 20
                    })
                  ],
                  indent: { left: 400 }
                })
              ])
            ] : []),

            ...(tailoredResume.additionalSkills && tailoredResume.additionalSkills.length > 0 ? [
              new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [
                  new TextRun({
                    text: '____________________',
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 300, after: 100 },
                children: [
                  new TextRun({
                    text: 'ADDITIONAL SKILLS',
                    bold: true,
                    size: 24,
                    allCaps: true
                  })
                ]
              }),

              ...tailoredResume.additionalSkills.map(skill =>
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: `- ${skill}`,
                      size: 20
                    })
                  ],
                  indent: { left: 400 }
                })
              )
            ] : [])
          ]
        }]
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `${tailoredResume.name.replace(/\s+/g, '_')}_Resume.docx`);

      toast({
        title: "DOCX Downloaded",
        description: "Your tailored resume DOCX has been downloaded."
      });
    } catch (error) {
      console.error('Error generating DOCX:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the DOCX file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      generatePDF();
    } else {
      generateDOCX();
    }
  };

  const submitFeedback = () => {
    alert(`Feedback submitted: ${feedbackText}`);
    setShowFeedbackInput(false);
    setFeedbackText('');
  };

  return (
    <div className="grid md:grid-cols-10 gap-6">
      <div className="md:col-span-7 space-y-6">
        <div className={`bg-card text-card-foreground rounded-lg border p-6 ${template === 'compact' ? 'space-y-3' : 'space-y-6'}`}>
          <div className="text-center">
            <h1 className="text-3xl font-bold">{tailoredResume.name}</h1>
            <div className={`flex flex-wrap justify-center gap-x-4 ${template === 'compact' ? 'mt-1' : 'mt-2'}`}>
              <a href={`tel:${tailoredResume.contactInfo.phone}`} className="text-primary hover:underline">
                {tailoredResume.contactInfo.phone}  |
              </a>
              <a href={`mailto:${tailoredResume.contactInfo.email}`} className="text-primary hover:underline">
                {tailoredResume.contactInfo.email}  |
              </a>
              <a href={`https://${tailoredResume.contactInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {tailoredResume.contactInfo.linkedin}
              </a>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                className="p-1 bg-green-500 rounded-full text-white"
                onClick={() => startEditing('summary')}
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>

            <div>
              <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                Professional Summary
              </h2>

              {editing.section === 'summary' ? (
                <div className="space-y-2">
                  <Textarea
                    value={editValues.summary}
                    onChange={(e) => setEditValues({ summary: e.target.value })}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdits}>
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p>{tailoredResume.summary}</p>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                className="p-1 bg-green-500 rounded-full text-white"
                onClick={() => startEditing('skills')}
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>

            <div>
              <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                Technical and Business Skills
              </h2>

              {editing.section === 'skills' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {editValues.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {skill}
                        <button
                          className="ml-1 text-red-500"
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex">
                    <Input
                      placeholder="Add a skill..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          addSkill(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdits}>
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {Object.entries({
                    Technical: tailoredResume.skills.filter(skill => ['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio'].includes(skill)),
                    Business: tailoredResume.skills.filter(skill => ['Project Management', 'Process Improvement', 'Process Automation'].includes(skill)),
                    'Programming Languages': tailoredResume.skills.filter(skill => ['PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle'].includes(skill)),
                    'Web Technologies': tailoredResume.skills.filter(skill => ['DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS'].includes(skill)),
                    Languages: tailoredResume.skills.filter(skill => ['Proficient in English and Swahili'].includes(skill))
                  }).map(([category, skills]) => skills.length > 0 && (
                    <p key={category} className="text-sm">
                      <span className="font-semibold">{category}:</span> {skills.join(', ')}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
              Professional Experience
            </h2>

            <div className={`space-y-${template === 'compact' ? '2' : '4'}`}>
              {tailoredResume.workExperiences.map((experience, expIndex) => (
                <div key={expIndex} className="relative group">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      className="p-1 bg-green-500 rounded-full text-white"
                      onClick={() => startEditing('experience', expIndex)}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold">{experience.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {experience.startDate} - {experience.endDate || 'Present'}
                      </span>
                    </div>
                    <p className={`text-lg ${template === 'compact' ? 'mb-1' : 'mb-2'}`}>
                      {experience.company} - {experience.location}
                    </p>

                    {editing.section === 'experience' && editing.index === expIndex ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {editValues.experience?.responsibilities.map((resp, rIndex) => (
                            <div key={rIndex} className="flex gap-2">
                              <Textarea
                                value={resp}
                                onChange={(e) => updateResponsibility(rIndex, e.target.value)}
                                className="flex-1"
                                rows={2}
                              />
                              <button
                                className="text-red-500 self-start mt-2"
                                onClick={() => removeResponsibility(rIndex)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addResponsibility}
                            className="flex-1"
                          >
                            Add Responsibility
                          </Button>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={cancelEditing}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={saveEdits}>
                            <Save className="mr-1 h-3 w-3" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <ul className={`pl-5 ${template === 'compact' ? 'space-y-0.5' : 'space-y-1'}`}>
                        {experience.responsibilities.map((resp, rIndex) => (
                          <li key={rIndex} className="list-decimal">{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
              Education
            </h2>

            <div className={`space-y-${template === 'compact' ? '2' : '3'}`}>
              {tailoredResume.education.map((edu, eduIndex) => (
                <div key={eduIndex} className="relative group">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      className="p-1 bg-green-500 rounded-full text-white"
                      onClick={() => startEditing('education', eduIndex)}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <span className="text-sm text-muted-foreground">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p>{edu.institution}{edu.gpa ? `, Graduated with a ${edu.gpa} GPA` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tailoredResume.certifications && tailoredResume.certifications.length > 0 && (
            <div className="relative group">
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  className="p-1 bg-green-500 rounded-full text-white"
                  onClick={() => startEditing('certifications', 0)}
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>

              <div>
                <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                  Professional Certifications
                </h2>
                <ul className={`pl-5 ${template === 'compact' ? 'space-y-0.5' : 'space-y-1'}`}>
                  {tailoredResume.certifications.map((cert, index) => (
                    <li key={index} className="list-disc">{cert.name} | {cert.dateRange}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tailoredResume.projects && tailoredResume.projects.length > 0 && (
            <div>
              <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                Projects
              </h2>
              <div className={`space-y-${template === 'compact' ? '2' : '3'}`}>
                {tailoredResume.projects.map((project, projIndex) => (
                  <div key={projIndex} className="relative group">
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        className="p-1 bg-green-500 rounded-full text-white"
                        onClick={() => startEditing('projects', projIndex)}
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-bold">{project.title}</h3>
                        <span className="text-sm text-muted-foreground">{project.date}</span>
                      </div>
                      <p>{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tailoredResume.additionalSkills && tailoredResume.additionalSkills.length > 0 && (
            <div className="relative group">
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  className="p-1 bg-green-500 rounded-full text-white"
                  onClick={() => startEditing('additionalSkills')}
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>

              <div>
                <h2 className={`font-bold ${template === 'compact' ? 'text-lg mb-1' : 'text-xl mb-2'} border-b pb-1`}>
                  Additional Skills
                </h2>

                {editing.section === 'additionalSkills' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {editValues.additionalSkills?.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={skill}
                            onChange={(e) => {
                              const updated = [...editValues.additionalSkills];
                              updated[index] = e.target.value;
                              setEditValues({ additionalSkills: updated });
                            }}
                            className="flex-1"
                          />
                          <button
                            className="text-red-500 self-start mt-2"
                            onClick={() => removeAdditionalSkill(skill)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an additional skill..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addAdditionalSkill(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveEdits}>
                        <Save className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className={`list-disc pl-5 ${template === 'compact' ? 'space-y-0.5' : 'space-y-1'}`}>
                    {tailoredResume.additionalSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-3 space-y-6">
        <div className="bg-card text-card-foreground rounded-lg border p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2">
              <div
                className="w-full h-full rounded-full"
                style={getGaugeStyle(matchData.finalScore)}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{matchData.finalScore}/10</span>
                </div>
              </div>
            </div>
            <p className={`text-base font-medium ${getScoreColor(matchData.finalScore)}`}>
              {getScoreLabel(matchData.finalScore)}
            </p>
          </div>

          <p className="text-center mb-2">
            Great! Your score jumped from {matchData.initialScore} to {matchData.finalScore}, closer to landing that interview!
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border">
          <h3 className="text-lg font-bold p-4 border-b">What's Changed</h3>

          <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center text-left">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Summary Enhanced</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
              We've rewritten the summary to align with the job, emphasizing key skills and responsibilities.
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center text-left">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Missing Skills Added</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
              <p>Added {selectedSkills.length} missing skills that are relevant to the job:</p>
              <ul className="list-disc pl-5 mt-1">
                {selectedSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
              <div className="flex items-center text-left">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Work Experience Enhanced</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground">
              Updated descriptions to highlight relevant achievements and incorporate job-specific keywords.
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <h3 className="text-lg font-bold mb-3">Template Options</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="standard-template"
                checked={template === 'standard'}
                onChange={() => setTemplate('standard')}
                className="h-4 w-4 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary dark:focus:ring-offset-gray-800"
              />
              <label htmlFor="standard-template" className="text-sm">
                Standard (full layout, normal spacing)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="compact-template"
                checked={template === 'compact'}
                onChange={() => setTemplate('compact')}
                className="h-4 w-4 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary dark:focus:ring-offset-gray-800"
              />
              <label htmlFor="compact-template" className="text-sm">
                Compact (tighter spacing, smaller margins)
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <h3 className="text-lg font-bold mb-3">How's Your Resume?</h3>
          {showFeedbackInput ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Tell us what you expected or how we can improve..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFeedbackInput(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={submitFeedback} disabled={!feedbackText.trim()}>
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => onFeedback(true)}
                variant="outline"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Looks Great!
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setShowFeedbackInput(true);
                  onFeedback(false);
                }}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Not What I Expected
              </Button>
            </div>
          )}
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <h2 className="text-lg font-bold mb-3">Download Resume</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={() => handleDownload('docx')}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Generating DOCX...' : 'Download as Word (.docx)'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Files will download directly to your device. No data is saved on our servers.
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border p-4">
          <Button
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Base Resume
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Changes made here apply to your base resume and affect future resumes.
          </p>
        </div>
      </div>
    </div>
  );
};