
import { Resume } from '../types/resume';
import { Resume as ExtendedResume } from '../types/index';

export function convertParsedDataToResume(parsedData: any, resumeName: string, resumeId?: string): Resume {
  // Safely extract data or provide defaults
  const personal = parsedData?.personal || {};
  const experiences = parsedData?.experience || [];
  const education = parsedData?.education || [];
  const skills = parsedData?.skills || [];
  
  // Map the parsed data to the Resume type
  const now = new Date();
  
  const result: Resume = {
    id: resumeId,
    name: resumeName || personal.full_name || 'Untitled Resume',
    jobTitle: experiences[0]?.title || '',
    yearsOfExperience: calculateYearsOfExperience(experiences),
    industries: deriveIndustriesFromExperience(experiences),
    skills: skills,
    summary: personal.summary_bio || '',
    contactInfo: {
      phone: personal.phone || '',
      email: personal.email || '',
      linkedin: personal.linkedin_url || ''
    },
    workExperiences: experiences.map((exp: any) => ({
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.start_date || '',
      endDate: exp.end_date || 'Present',
      responsibilities: exp.achievements || []
    })),
    education: education.map((edu: any) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field_of_study || '',
      startDate: edu.start_date || '',
      endDate: edu.end_date || '',
      gpa: ''
    })),
    projects: [],
    // Add required properties from types/index.ts Resume type
    file_path: '',
    isPrimary: false,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    uploadDate: now
  };
  
  return result;
}

// Helper function to calculate approximate years of experience from work history
function calculateYearsOfExperience(experiences: any[]): number {
  let totalMonths = 0;
  
  experiences.forEach(exp => {
    if (!exp.start_date) return;
    
    const startParts = exp.start_date.split('-');
    const startYear = parseInt(startParts[0]);
    const startMonth = startParts.length > 1 ? parseInt(startParts[1]) : 1;
    
    let endYear, endMonth;
    
    if (exp.end_date && exp.end_date.toLowerCase() !== 'present') {
      const endParts = exp.end_date.split('-');
      endYear = parseInt(endParts[0]);
      endMonth = endParts.length > 1 ? parseInt(endParts[1]) : 12;
    } else {
      // If end_date is 'present' or undefined, use current date
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    }
    
    totalMonths += (endYear - startYear) * 12 + (endMonth - startMonth);
  });
  
  return Math.max(0, Math.round(totalMonths / 12));
}

// Helper function to derive industries from experience
function deriveIndustriesFromExperience(experiences: any[]): string[] {
  // This is a simplified approach - in a real scenario, you might have a more sophisticated mapping
  const industries = new Set<string>();
  
  experiences.forEach(exp => {
    if (exp.job_type) {
      industries.add(exp.job_type);
    }
    // Add more industry inference logic as needed
  });
  
  return Array.from(industries);
}
