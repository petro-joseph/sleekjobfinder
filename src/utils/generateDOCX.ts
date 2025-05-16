
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TableCell, TableRow, Table, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { Resume } from '@/types/resume';
import { formatDetail } from '@/lib/utils';

export async function generateDOCX(resumeData: Resume, toast: any) {
  try {
    // Create sections for the document
    const sections = [];
    
    // Header with contact info
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.name || '',
            size: 28,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    );
    
    // Contact information
    const contactInfo = [];
    if (resumeData.contactInfo?.email) {
      contactInfo.push(resumeData.contactInfo.email);
    }
    if (resumeData.contactInfo?.phone) {
      contactInfo.push(resumeData.contactInfo.phone);
    }
    
    // Use location directly from the resume data if it exists
    if (resumeData.contactInfo?.linkedin) {
      contactInfo.push(resumeData.contactInfo.linkedin);
    }
    
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo.join(' | '),
            size: 24,
          }),
        ],
        spacing: { after: 400 },
      })
    );
    
    // Summary section
    if (resumeData.summary) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.summary,
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }
    
    // Skills section
    if (resumeData.skills && resumeData.skills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.skills.join(', '),
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }
    
    // Work Experience
    if (resumeData.workExperiences && resumeData.workExperiences.length > 0) {
      sections.push(
        new Paragraph({
          text: 'WORK EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      resumeData.workExperiences.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          })
        );
        
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company} | ${exp.location} | ${exp.startDate} - ${exp.endDate || 'Present'}`,
                italics: true,
              }),
            ],
            spacing: { after: 200 },
          })
        );
        
        exp.responsibilities.forEach((resp) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${resp}`,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        });
        
        // Handle subsections if they exist
        if (exp.subSections && exp.subSections.length > 0) {
          exp.subSections.forEach(sub => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: sub.title,
                    bold: true,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
            
            sub.details.forEach(detail => {
              sections.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${formatDetail(detail)}`,
                    }),
                  ],
                  spacing: { after: 100 },
                })
              );
            });
          });
        }
        
        // Add spacing between experiences
        sections.push(
          new Paragraph({
            spacing: { after: 200 },
          })
        );
      });
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      resumeData.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          })
        );
        
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.institution} | ${edu.startDate || ''} - ${edu.endDate || 'Present'}`,
                italics: true,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      });
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      resumeData.projects.forEach((project) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.title,
                bold: true,
              }),
              new TextRun({
                text: ` | ${project.date}`,
              }),
            ],
            spacing: { after: 100 },
          })
        );
        
        if (project.role) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.role,
                  italics: true,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
        
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.description,
              }),
            ],
            spacing: { after: 100 },
          })
        );

        if (project.technologies && project.technologies.length > 0) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${project.technologies.join(', ')}`,
                  italics: true,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        } else {
          sections.push(new Paragraph({ spacing: { after: 200 } }));
        }
      });
    }

    // Certifications
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      sections.push(
        new Paragraph({
          text: 'CERTIFICATIONS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      resumeData.certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
              }),
              new TextRun({
                text: cert.dateRange ? ` | ${cert.dateRange}` : '',
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });
      
      sections.push(new Paragraph({ spacing: { after: 200 } }));
    }

    // Additional Skills
    if (resumeData.additionalSkills && resumeData.additionalSkills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'ADDITIONAL SKILLS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.additionalSkills.join(', '),
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    // Soft Skills
    if (resumeData.softSkills && resumeData.softSkills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SOFT SKILLS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { after: 200 },
        })
      );
      
      resumeData.softSkills.forEach((skill) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: skill.name,
                bold: true,
              }),
            ],
            spacing: { after: 50 },
          })
        );
        
        if (skill.description) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: skill.description,
                }),
              ],
              spacing: { after: 150 },
            })
          );
        }
      });
    }
    
    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });
    
    // Generate and save file
    const buffer = await Packer.toBlob(doc);
    // Use name parts from the resume data for the filename
    const nameParts = resumeData.name ? resumeData.name.split(' ') : ['Resume'];
    const filename = `${nameParts[0] || 'Resume'}_${nameParts[1] || ''}_${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(buffer, filename);
    
    toast({
      title: "DOCX Generated Successfully",
      description: `Your resume has been downloaded as ${filename}`,
    });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    toast({
      title: "Error Generating DOCX",
      description: "There was an error creating your resume document. Please try again.",
      variant: "destructive",
    });
  }
}
