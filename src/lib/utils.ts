
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Resume } from "@/types/resume";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe string conversion utility
export function safeToString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

// Safe array check utility
export function isValidArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

// Helper to format project details
export function formatDetail(detail: string | { title?: string; role?: string; description?: string }): string {
  if (typeof detail === 'string') {
    return detail;
  }
  
  let result = '';
  if (detail.title) result += detail.title;
  if (detail.role) result += result ? ` - ${detail.role}` : detail.role;
  if (detail.description && !result.includes(detail.description)) {
    result += result ? `: ${detail.description}` : detail.description;
  }
  
  return result || '';
}

// Convert Resume to Markdown format
export function resumeToMarkdown(resume: Resume): string {
  let markdown = '';
  
  // Header with contact info
  markdown += `# ${resume.name}\n\n`;
  
  const contactDetails = [];
  if (resume.contactInfo.email) contactDetails.push(resume.contactInfo.email);
  if (resume.contactInfo.phone) contactDetails.push(resume.contactInfo.phone);
  if (resume.contactInfo.linkedin) contactDetails.push(resume.contactInfo.linkedin);
  
  markdown += `${contactDetails.join(' | ')}\n\n`;
  
  // Summary
  if (resume.summary) {
    markdown += `## PROFESSIONAL SUMMARY\n\n${resume.summary}\n\n`;
  }
  
  // Skills
  if (resume.skills && resume.skills.length > 0) {
    markdown += `## TECHNICAL AND BUSINESS SKILLS\n\n`;
    markdown += resume.skills.map(skill => `- ${skill}`).join('\n');
    markdown += '\n\n';
  }
  
  // Work Experience
  if (resume.workExperiences && resume.workExperiences.length > 0) {
    markdown += `## WORK EXPERIENCE\n\n`;
    
    resume.workExperiences.forEach(exp => {
      markdown += `### ${exp.title}\n`;
      markdown += `*${exp.company} | ${exp.location} | ${exp.startDate} - ${exp.endDate || 'Present'}*\n\n`;
      
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach(resp => {
          markdown += `- ${resp}\n`;
        });
        markdown += '\n';
      }
      
      // Handle subsections if they exist
      if (exp.subSections && exp.subSections.length > 0) {
        exp.subSections.forEach(sub => {
          markdown += `#### ${sub.title}\n\n`;
          
          if (Array.isArray(sub.details)) {
            sub.details.forEach(detail => {
              if (typeof detail === 'string') {
                markdown += `- ${detail}\n`;
              } else {
                // It's a Project
                markdown += `- **${detail.title}** ${detail.date ? `(${detail.date})` : ''}\n`;
                if (detail.role) markdown += `  - Role: ${detail.role}\n`;
                if (detail.description) markdown += `  - ${detail.description}\n`;
                if (detail.technologies && detail.technologies.length > 0) {
                  markdown += `  - Technologies: ${detail.technologies.join(', ')}\n`;
                }
              }
            });
          }
          markdown += '\n';
        });
      }
    });
  }
  
  // Education
  if (resume.education && resume.education.length > 0) {
    markdown += `## EDUCATION\n\n`;
    
    resume.education.forEach(edu => {
      markdown += `### ${edu.degree}\n`;
      markdown += `*${edu.institution} | ${edu.startDate} - ${edu.endDate || 'Present'}*`;
      if (edu.gpa) markdown += ` | GPA: ${edu.gpa}`;
      markdown += '\n\n';
    });
  }
  
  // Projects
  if (resume.projects && resume.projects.length > 0) {
    markdown += `## PROJECTS\n\n`;
    
    resume.projects.forEach(project => {
      markdown += `### ${project.title} ${project.date ? `| ${project.date}` : ''}\n`;
      if (project.role) markdown += `*${project.role}*\n\n`;
      if (project.description) markdown += `${project.description}\n\n`;
      if (project.technologies && project.technologies.length > 0) {
        markdown += `*Technologies: ${project.technologies.join(', ')}*\n\n`;
      }
    });
  }
  
  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    markdown += `## PROFESSIONAL CERTIFICATIONS\n\n`;
    
    resume.certifications.forEach(cert => {
      markdown += `- **${cert.name}**${cert.dateRange ? ` | ${cert.dateRange}` : ''}\n`;
    });
    markdown += '\n';
  }
  
  // Additional Skills
  if (resume.additionalSkills && resume.additionalSkills.length > 0) {
    markdown += `## ADDITIONAL SKILLS\n\n`;
    markdown += resume.additionalSkills.map(skill => `- ${skill}`).join('\n');
    markdown += '\n\n';
  }
  
  // Soft Skills
  if (resume.softSkills && resume.softSkills.length > 0) {
    markdown += `## SOFT SKILLS\n\n`;
    
    resume.softSkills.forEach(skill => {
      markdown += `### ${skill.name}\n`;
      if (skill.description) markdown += `${skill.description}\n`;
      markdown += '\n';
    });
  }
  
  return markdown;
}
