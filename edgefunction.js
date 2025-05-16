import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Import CORS headers from shared module
import { corsHeaders } from "../_shared/cors.ts";
// Convert the parsed data from the database to the Resume type
function convertParsedDataToResume(parsedData) {
  // Safely extract data or provide defaults
  const personal = parsedData?.personal || {};
  const experiences = parsedData?.experience || [];
  const education = parsedData?.education || [];
  const skills = parsedData?.skills || [];
  // Extract certifications from raw text if available
  const certifications = [];
  // Look for certifications section in raw text
  const rawText = parsedData?.raw_text || '';
  if (rawText) {
    const certRegex = /([A-Za-z\s]+):\s*([A-Za-z]+\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{4})/g;
    let match;
    while((match = certRegex.exec(rawText)) !== null){
      certifications.push({
        name: match[1].trim(),
        dateRange: `${match[2]} - ${match[3]}`
      });
    }
  }
  // Extract project information
  const projects = [];
  const projectsSection = rawText.match(/PROJECTS\s*\n\n([\s\S]*?)(?:\n\n|$)/);
  if (projectsSection && projectsSection[1]) {
    const projectEntries = projectsSection[1].split('\n\n').filter((entry)=>entry.trim());
    projectEntries.forEach((entry)=>{
      const titleMatch = entry.match(/^(.+?)(?:\s+([A-Za-z]+\s+\d{4}))?$/m);
      const descriptionMatch = entry.match(/•\s+(.+)/);
      if (titleMatch) {
        projects.push({
          title: titleMatch[1].trim(),
          date: titleMatch[2] ? titleMatch[2].trim() : '',
          description: descriptionMatch ? descriptionMatch[1].trim() : '',
          role: entry.match(/Role:\s*(.+)/i)?.length > 1 ? entry.match(/Role:\s*(.+)/i)[1].trim() : undefined
        });
      }
    });
  }
  // Extract soft skills
  const softSkills = [];
  skills.forEach((skill)=>{
    if (typeof skill === 'string' && (skill.includes('communication') || skill.includes('leadership') || skill.includes('interpersonal') || skill.includes('organized') || skill.includes('learning mindset'))) {
      softSkills.push({
        name: skill.split(':')[0] || skill,
        description: skill.split(':')[1] || ''
      });
    }
  });
  // Extract technical skills as additional skills
  const additionalSkills = skills.filter((skill)=>typeof skill === 'string' && !softSkills.some((s)=>s.name === skill));
  // Convert parsed experiences to the WorkExperience type
  const workExperiences = experiences.map((exp)=>{
    return {
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.start_date || '',
      endDate: exp.end_date || 'Present',
      responsibilities: Array.isArray(exp.achievements) ? exp.achievements : [],
      subSections: [] // Prepare for potential subsections
    };
  });
  // Map the parsed data to the Resume type
  const result = {
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
    education: education.map((edu)=>({
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
function calculateYearsOfExperience(experiences) {
  let totalMonths = 0;
  experiences.forEach((exp)=>{
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
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    }
    totalMonths += (endYear - startYear) * 12 + (endMonth - startMonth);
  });
  return Math.max(0, Math.round(totalMonths / 12));
}
// Helper function to derive industries from experience
function deriveIndustriesFromExperience(experiences) {
  const industries = new Set();
  experiences.forEach((exp)=>{
    if (exp.job_type) industries.add(exp.job_type);
    if (exp.industry) industries.add(exp.industry);
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
async function tailorResume(resume, jobPosting, selectedSections, selectedSkills) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  const tailoredResume = JSON.parse(JSON.stringify(resume));
  try {
    const prompt = `
Create a tailored resume based on the provided job description and the candidate's current resume. Ensure the output includes all sections in the exact format of the original resume: Professional Summary, Professional Experiences (with numbered sub-sections and Key Projects), Education, Professional Certifications, Technical Skills, and Soft Skills. Follow these guidelines to optimize for applicant tracking systems (ATS) and human recruiters while preserving the original structure:

1. **Job Description Analysis**: Extract key skills, action verbs, and industry-specific terms from the job description:
   - Title: ${jobPosting.title}
   - Company: ${jobPosting.company}
   - Required Skills: ${jobPosting.requiredSkills.join(', ')}
   - Description: ${jobPosting.description}

2. **Customization**: Incorporate extracted keywords and phrases naturally into the specified sections without altering the format (e.g., numbered lists for Professional Experiences, bullet points for Skills).

3. **Relevance**: Focus on the candidate’s most relevant job roles, skills, achievements, certifications, and projects that align with the job description. Preserve all fields, including project names and roles.

4. **Conciseness**: Keep the resume concise, targeting one page unless the candidate has over 10 years of experience. Use ATS-friendly formatting.

5. **Achievement-Oriented Content**: Highlight measurable achievements using action verbs (e.g., “increased,” “developed”). Quantify results where possible (e.g., “Grew revenue by 20%”).

6. **ATS Optimization**: Use standard section headers and avoid tables or complex formatting.

7. **Format Preservation**: Maintain the exact structure:
   - Professional Summary: Single paragraph.
   - Professional Experiences: Numbered sub-sections (e.g., 1. Backend Development) and Key Projects with Role, Impact, and Technologies.
   - Education: Degree, institution, dates, GPA.
   - Professional Certifications: List with name and date range.
   - Technical Skills: Bullet-pointed categories (e.g., Programming Languages).
   - Soft Skills: Bullet-pointed name and description pairs.

Provide tailored content for the following sections based on the selected sections:
${selectedSections.summary ? '- An improved professional summary that highlights relevant skills and experience.' : ''}
${selectedSections.experience ? '- Improved sub-sections and Key Projects under Professional Experiences, emphasizing relevant achievements and skills.' : ''}
${selectedSections.skills ? '- An updated Technical Skills list incorporating relevant job-specific skills, merging without duplicates (case-insensitive).' : ''}
${selectedSections.certifications ? '- Tailored certifications, prioritizing those relevant to the job.' : ''}
${selectedSections.projects ? '- Improved Key Projects under Professional Experiences, emphasizing relevant technologies, outcomes, and roles.' : ''}
${selectedSections.additionalSkills ? '- Updated Technical Skills to reflect job-relevant competencies.' : ''}
${selectedSections.softSkills ? '- Updated Soft Skills to emphasize job-relevant traits.' : ''}

Current resume details:
- Summary: "${resume.summary}"
- Professional Experiences:
  ${resume.workExperiences.map((exp, i)=>`
  ${i + 1}. ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate}, ${exp.location}):
     ${exp.subSections.map((sub, j)=>`${j + 1}. ${sub.title}: ${sub.details.join(', ')}`).join('\n     ')}
     Key Projects:
     ${exp.subSections.find((sub)=>sub.title === 'Key Projects')?.details.map((proj)=>`- ${proj.title}: Role: ${proj.role}, Impact: ${proj.impact}, Technologies: ${proj.technologies}`).join('\n     ') || 'N/A'}
  `).join('\n')}
- Education: ${resume.education.map((edu)=>`${edu.degree}, ${edu.institution}, ${edu.startDate} - ${edu.endDate}, GPA: ${edu.gpa}`).join(', ')}
- Certifications: ${resume.certifications?.map((c)=>`${c.name} (${c.dateRange})`).join(', ') || 'N/A'}
- Technical Skills: ${resume.skills.join(', ')}
- Soft Skills: ${resume.softSkills?.map((s)=>`${s.name}: ${s.description}`).join(', ') || 'N/A'}

Format the response as a JSON object with all sections, updating only the specified sections, preserving the exact structure:
{
  "name": "${resume.name}",
  "jobTitle": "${jobPosting.title}",
  "yearsOfExperience": ${resume.yearsOfExperience},
  "industries": ${JSON.stringify(resume.industries)},
  "skills": ${selectedSections.skills ? '["skill1", "skill2", ...]' : JSON.stringify(resume.skills)},
  "summary": ${selectedSections.summary ? '"improved summary text"' : JSON.stringify(resume.summary)},
  "contactInfo": ${JSON.stringify(resume.contactInfo)},
  "workExperiences": ${selectedSections.experience || selectedSections.projects ? '[{"title": "...", "company": "...", "location": "...", "startDate": "...", "endDate": "...", "responsibilities": ["..."], "subSections": [{"title": "Backend Development", "details": ["..."]}, {"title": "Key Projects", "details": [{"title": "...", "role": "...", "impact": "...", "technologies": "..."}]}]}]' : JSON.stringify(resume.workExperiences)},
  "education": ${JSON.stringify(resume.education)},
  "certifications": ${selectedSections.certifications ? '[{"name": "...", "dateRange": "..."}]' : JSON.stringify(resume.certifications || undefined)},
  "projects": ${selectedSections.projects ? '[{"title": "...", "date": "...", "description": "...", "role": "..."}]' : JSON.stringify(resume.projects || undefined)},
  "additionalSkills": ${selectedSections.additionalSkills ? '["skill1", "skill2", ...]' : JSON.stringify(resume.additionalSkills || undefined)},
  "softSkills": ${selectedSections.softSkills ? '[{"name": "...", "description": "..."}]' : JSON.stringify(resume.softSkills || undefined)}
}
`;
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
            content: 'You are a professional resume writer who helps tailor resumes to specific job descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });
    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      console.error('Unexpected response from OpenAI:', data);
      throw new Error('Failed to get a valid response from OpenAI');
    }
    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const tailoredContent = JSON.parse(jsonMatch[0]);
        if (selectedSections.summary && tailoredContent.summary) {
          tailoredResume.summary = tailoredContent.summary;
        }
        if (selectedSections.experience && tailoredContent.workExperiences) {
          tailoredResume.workExperiences = tailoredContent.workExperiences.map((exp)=>({
              ...exp,
              subSections: exp.subSections || [],
              responsibilities: exp.responsibilities || []
            }));
        }
        if (selectedSections.skills && tailoredContent.skills) {
          tailoredResume.skills = tailoredContent.skills;
        }
        if (selectedSections.certifications && tailoredContent.certifications) {
          tailoredResume.certifications = tailoredContent.certifications;
        }
        if (selectedSections.projects && tailoredContent.projects) {
          tailoredResume.projects = tailoredContent.projects.map((proj)=>({
              title: proj.title || '',
              date: proj.date || '',
              description: proj.description || '',
              role: proj.role || undefined
            }));
          tailoredResume.workExperiences = tailoredResume.workExperiences.map((exp, i)=>({
              ...exp,
              subSections: exp.subSections.map((sub)=>sub.title === 'Key Projects' ? {
                  ...sub,
                  details: tailoredContent.projects.map((proj)=>({
                      title: proj.title,
                      role: proj.role,
                      impact: proj.description,
                      technologies: proj.technologies || 'N/A'
                    }))
                } : sub)
            }));
        }
        if (selectedSections.additionalSkills && tailoredContent.additionalSkills) {
          tailoredResume.additionalSkills = tailoredContent.additionalSkills;
        }
        if (selectedSections.softSkills && tailoredContent.softSkills) {
          tailoredResume.softSkills = tailoredContent.softSkills;
        }
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      if (selectedSections.summary) {
        tailoredResume.summary = `Experienced ${resume.jobTitle} with ${resume.yearsOfExperience} years of expertise in ${resume.industries.join(', ') || 'Technology'}. Proven track record in ${jobPosting.requiredSkills[0] || 'relevant areas'}. Seeking to leverage skills in ${jobPosting.requiredSkills.slice(0, 3).join(', ')} at ${jobPosting.company}.`;
      }
      if (selectedSections.skills) {
        const currentSkillsLower = tailoredResume.skills.map((s)=>s.toLowerCase());
        const skillsToAdd = selectedSkills.filter((s)=>!currentSkillsLower.includes(s.toLowerCase()));
        tailoredResume.skills = [
          ...tailoredResume.skills,
          ...skillsToAdd
        ];
      }
      if (selectedSections.certifications) {
        tailoredResume.certifications = resume.certifications || undefined;
      }
      if (selectedSections.projects) {
        tailoredResume.projects = resume.projects.map((proj)=>({
            title: proj.title || '',
            date: proj.date || '',
            description: proj.description || '',
            role: proj.role || undefined
          })) || undefined;
      }
      if (selectedSections.additionalSkills) {
        tailoredResume.additionalSkills = resume.additionalSkills || undefined;
      }
      if (selectedSections.softSkills) {
        tailoredResume.softSkills = resume.softSkills || undefined;
      }
    }
    return tailoredResume;
  } catch (error) {
    console.error('Error in tailorResume function:', error);
    throw new Error(`Failed to tailor resume: ${error.message}`);
  }
}
// Main function logic
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    console.log('Processing POST request');
    const { resume_id, job_posting, selected_sections, selected_skills } = await req.json();
    if (!resume_id || !job_posting) {
      return new Response(JSON.stringify({
        error: 'Missing required parameters: resume_id or job_posting'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log('Initializing Supabase client');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    }
    const authHeader = req.headers.get('Authorization') || `Bearer ${supabaseAnonKey}`;
    console.log('Auth Header:', authHeader);
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    console.log('Supabase client initialized successfully');
    console.log('Fetching resume with id:', resume_id);
    const { data: resumeData, error: resumeError } = await supabase.from('resumes').select('parsed_data, name').eq('id', resume_id).single();
    if (resumeError || !resumeData) {
      console.error('Failed to fetch resume:', {
        resume_id,
        error: resumeError?.message
      });
      return new Response(JSON.stringify({
        error: 'Failed to fetch resume data',
        details: resumeError?.message
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log('Converting parsed data to Resume format');
    const parsedData = resumeData.parsed_data;
    if (!parsedData) {
      return new Response(JSON.stringify({
        error: 'The resume has no parsed data available'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const resume = convertParsedDataToResume(parsedData);
    resume.name = parsedData.personal?.full_name || resumeData.name;
    console.log('Converted resume structure:', JSON.stringify({
      hasProjects: !!resume.projects && resume.projects.length > 0,
      hasCertifications: !!resume.certifications && resume.certifications.length > 0,
      hasAdditionalSkills: !!resume.additionalSkills && resume.additionalSkills.length > 0,
      hasSoftSkills: !!resume.softSkills && resume.softSkills.length > 0,
      name: resume.name,
      skills: resume.skills.length,
      experiences: resume.workExperiences.length
    }));
    console.log('Tailoring resume');
    const tailoredResume = await tailorResume(resume, job_posting, selected_sections, selected_skills);
    return new Response(JSON.stringify({
      success: true,
      data: tailoredResume
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in tailor-resume function:', error.message);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
