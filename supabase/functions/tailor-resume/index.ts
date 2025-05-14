
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import CORS headers from shared module
import { corsHeaders } from "../_shared/cors.ts";

// Define types to match the frontend
interface JobPosting {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  requiredYearsOfExperience: number;
  industries: string[];
  requiredSkills: string[];
  description: string;
}

interface Project {
  title: string;
  date: string;
  description: string;
  role?: string;
  impact?: string;
  technologies?: string[];
}

interface WorkExperience {
  title: string; 
  company: string; 
  location: string; 
  startDate: string; 
  endDate: string; 
  responsibilities: string[];
  subSections?: Array<{
    title: string; 
    details: string[] | Project[];
  }>;
}

interface Resume {
  id?: string;
  name: string;
  jobTitle: string;
  yearsOfExperience: number;
  industries: string[];
  skills: string[];
  summary: string;
  contactInfo: { 
    phone: string; 
    email: string; 
    linkedin: string 
  };
  workExperiences: WorkExperience[];
  education: Array<{
    institution: string; 
    degree: string; 
    startDate: string; 
    endDate: string; 
    gpa?: string;
  }>;
  projects?: Project[];
  certifications?: Array<{
    name: string; 
    dateRange: string;
  }>;
  additionalSkills?: string[];
  softSkills?: Array<{
    name: string;
    description: string;
  }>;
}

interface TailorRequest {
  resume_id: string;
  job_posting: JobPosting;
  selected_sections: {
    summary: boolean;
    skills: boolean;
    experience: boolean;
    projects?: boolean;
    certifications?: boolean;
    additionalSkills?: boolean;
    softSkills?: boolean;
    editMode: 'quick' | 'full';
  };
  selected_skills: string[];
}

// Convert the parsed data from the database to the Resume type
function convertParsedDataToResume(parsedData: any): Resume {
  // Safely extract data or provide defaults
  const personal = parsedData?.personal || {};
  const experiences = parsedData?.experience || [];
  const education = parsedData?.education || [];
  const skills = parsedData?.skills || [];
  
  // Extract certifications from raw text if available
  const certifications: Array<{name: string, dateRange: string}> = [];
  
  // Look for certifications section in raw text
  const rawText = parsedData?.raw_text || '';
  if (rawText) {
    const certRegex = /([A-Za-z\s]+):\s*([A-Za-z]+\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{4})/g;
    let match;
    while ((match = certRegex.exec(rawText)) !== null) {
      certifications.push({
        name: match[1].trim(),
        dateRange: `${match[2]} - ${match[3]}`
      });
    }
  }
  
  // Extract project information
  const projects: Project[] = [];
  const projectsSection = rawText.match(/PROJECTS\s*\n\n([\s\S]*?)(?:\n\n|$)/);
  
  if (projectsSection && projectsSection[1]) {
    const projectEntries = projectsSection[1].split('\n\n').filter(entry => entry.trim());
    
    projectEntries.forEach(entry => {
      const titleMatch = entry.match(/^(.+?)(?:\s+([A-Za-z]+\s+\d{4}))?$/m);
      const descriptionMatch = entry.match(/•\s+(.+)/);
      
      if (titleMatch) {
        projects.push({
          title: titleMatch[1].trim(),
          date: titleMatch[2] ? titleMatch[2].trim() : '',
          description: descriptionMatch ? descriptionMatch[1].trim() : '',
          role: entry.match(/Role:\s*(.+)/i)?.length > 1 ? entry.match(/Role:\s*(.+)/i)![1].trim() : undefined
        });
      }
    });
  }
  
  // Extract soft skills
  const softSkills: Array<{name: string, description: string}> = [];
  skills.forEach(skill => {
    if (typeof skill === 'string' && 
        (skill.includes('communication') || 
         skill.includes('leadership') || 
         skill.includes('interpersonal') || 
         skill.includes('organized') || 
         skill.includes('learning mindset'))) {
      softSkills.push({
        name: skill.split(':')[0] || skill,
        description: skill.split(':')[1] || ''
      });
    }
  });
  
  // Extract technical skills as additional skills
  const additionalSkills = skills.filter(skill => 
    typeof skill === 'string' && 
    !softSkills.some(s => s.name === skill)
  );
  
  // Convert parsed experiences to the WorkExperience type
  const workExperiences = experiences.map((exp) => {
    return {
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.start_date || '',
      endDate: exp.end_date || 'Present',
      responsibilities: Array.isArray(exp.achievements) ? exp.achievements : [],
      subSections: []  // Prepare for potential subsections
    };
  });
  
  // Map the parsed data to the Resume type
  const result: Resume = {
    name: personal.full_name || '',
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
    workExperiences: workExperiences,
    education: education.map((edu) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      startDate: edu.start_date || '',
      endDate: edu.end_date || '',
      gpa: edu.description ? edu.description.match(/GPA\s*:\s*([\d.]+)/i)?.[1] || '' : ''
    })),
    projects: projects,
    certifications: certifications.length > 0 ? certifications : undefined,
    additionalSkills: additionalSkills.length > 0 ? additionalSkills : undefined,
    softSkills: softSkills.length > 0 ? softSkills : undefined
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
    if (exp.industry) {
      industries.add(exp.industry);
    }
    // Add more industry inference logic
    if (exp.company?.toLowerCase().includes('tech') || exp.summary?.toLowerCase().includes('software')) {
      industries.add('Technology');
    }
    if (exp.company?.toLowerCase().includes('college') || exp.summary?.toLowerCase().includes('education')) {
      industries.add('Education');
    }
    if (exp.company?.toLowerCase().includes('health') || exp.summary?.toLowerCase().includes('healthcare')) {
      industries.add('Healthcare');
    }
  });
  
  return Array.from(industries);
}

// Use OpenAI to tailor the resume
async function tailorResume(resume: Resume, jobPosting: JobPosting, selectedSections: any, selectedSkills: string[]): Promise<Resume> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  // Create a deep copy of the resume to avoid modifying the original
  const tailoredResume = JSON.parse(JSON.stringify(resume)) as Resume;
  
  try {
    // Prepare the prompt for OpenAI
    const prompt = `
    I need to tailor a resume for a job. Here's the job posting:
    
    Title: ${jobPosting.title}
    Company: ${jobPosting.company}
    Required Skills: ${jobPosting.requiredSkills.join(', ')}
    Description: ${jobPosting.description}
    
    Here's the current resume summary:
    "${resume.summary}"
    
    Here's the current work experience (for the most recent role):
    Title: ${resume.workExperiences[0]?.title || 'N/A'}
    Company: ${resume.workExperiences[0]?.company || 'N/A'}
    Responsibilities:
    ${resume.workExperiences[0]?.responsibilities.join('\n') || 'N/A'}
    
    Please provide the following ${selectedSections.summary ? 'including an improved summary' : 'without changing the summary'}
    ${selectedSections.experience ? ', including improved work experience descriptions' : ', without changing work experience'}:
    
    1. ${selectedSections.summary ? 'An improved professional summary that highlights relevant skills and experience for this job. Make it ATS-friendly by incorporating key terms from the job posting while keeping it readable for humans.' : ''}
    2. ${selectedSections.experience ? 'Improved bullet points for work experience that emphasize achievements and skills relevant to this job. Format as clear, action-oriented statements that quantify impact where possible.' : ''}
    
    Format your response as a JSON object with these keys:
    ${selectedSections.summary ? '"summary": "improved summary text",' : ''}
    ${selectedSections.experience ? '"workExperience": [{"responsibilities": ["bullet1", "bullet2", ...]}]' : ''}
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer who helps tailor resumes to specific job descriptions. Create ATS-optimized content while keeping it readable for humans.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error('Unexpected response from OpenAI:', data);
      throw new Error('Failed to get a valid response from OpenAI');
    }
    
    try {
      // Parse the OpenAI response
      const content = data.choices[0].message.content;
      // Extract the JSON part from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const tailoredContent = JSON.parse(jsonMatch[0]);
        
        // Update the resume with the tailored content
        if (selectedSections.summary && tailoredContent.summary) {
          tailoredResume.summary = tailoredContent.summary;
        }
        
        if (selectedSections.experience && tailoredContent.workExperience) {
          // Update work experience based on the mode (quick or full)
          const numExperiencesToEnhance = selectedSections.editMode === 'quick' 
            ? Math.min(2, tailoredResume.workExperiences.length) 
            : tailoredResume.workExperiences.length;
            
          for (let i = 0; i < numExperiencesToEnhance; i++) {
            if (tailoredResume.workExperiences[i] && tailoredContent.workExperience[i]) {
              tailoredResume.workExperiences[i].responsibilities = 
                tailoredContent.workExperience[i].responsibilities || tailoredResume.workExperiences[i].responsibilities;
            }
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // If parsing fails, apply some basic tailoring instead
      if (selectedSections.summary) {
        tailoredResume.summary = `Experienced ${resume.jobTitle} with ${resume.yearsOfExperience} years of expertise in ${resume.industries.join(', ')}. Proven track record of delivering results in ${jobPosting.requiredSkills[0] || 'relevant areas'}. Seeking to leverage my skills in ${jobPosting.requiredSkills.slice(0, 3).join(', ')} to drive innovation at ${jobPosting.company}.`;
      }
    }
    
    // Add selected skills regardless of OpenAI response
    if (selectedSections.skills) {
      const currentSkillsLower = tailoredResume.skills.map(s => s.toLowerCase());
      const skillsToAdd = selectedSkills.filter(s => !currentSkillsLower.includes(s.toLowerCase()));
      tailoredResume.skills = [...tailoredResume.skills, ...skillsToAdd];
    }
    
    // Make sure certifications, projects, additionalSkills, and softSkills are kept
    if (!tailoredResume.certifications && resume.certifications) {
      tailoredResume.certifications = resume.certifications;
    }
    
    if (!tailoredResume.projects && resume.projects) {
      tailoredResume.projects = resume.projects;
    }
    
    if (!tailoredResume.additionalSkills && resume.additionalSkills) {
      tailoredResume.additionalSkills = resume.additionalSkills;
    }
    
    if (!tailoredResume.softSkills && resume.softSkills) {
      tailoredResume.softSkills = resume.softSkills;
    }
    
    return tailoredResume;
  } catch (error) {
    console.error('Error in tailorResume function:', error);
    throw new Error(`Failed to tailor resume: ${error.message}`);
  }
}

// Main function logic
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume_id, job_posting, selected_sections, selected_skills } = await req.json() as TailorRequest;
    
    if (!resume_id || !job_posting) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: resume_id or job_posting' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching resume with id: ${resume_id}`);
    
    // Configure Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Fetch the resume from Supabase
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('parsed_data, name')
      .eq('id', resume_id)
      .single();

    if (resumeError || !resumeData) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch resume data', details: resumeError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert the parsed data to the Resume type
    const parsedData = resumeData.parsed_data;
    
    if (!parsedData) {
      return new Response(
        JSON.stringify({ error: 'The resume has no parsed data available' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Converting parsed data to Resume format');
    const resume = convertParsedDataToResume(parsedData);
    resume.name = parsedData.personal?.full_name || resumeData.name; // Use the actual person's name
    
    // Log the structure of converted resume to help with debugging
    console.log('Converted resume structure:', JSON.stringify({
      hasProjects: !!resume.projects && resume.projects.length > 0,
      hasCertifications: !!resume.certifications && resume.certifications.length > 0,
      hasAdditionalSkills: !!resume.additionalSkills && resume.additionalSkills.length > 0,
      hasSoftSkills: !!resume.softSkills && resume.softSkills.length > 0,
      name: resume.name,
      skills: resume.skills.length,
      experiences: resume.workExperiences.length
    }));
    
    // Tailor the resume using OpenAI
    console.log('Tailoring resume');
    const tailoredResume = await tailorResume(resume, job_posting, selected_sections, selected_skills);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: tailoredResume 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in tailor-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
