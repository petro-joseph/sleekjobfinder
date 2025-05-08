
import { supabase } from "@/integrations/supabase/client";
import { Resume, JobPosting } from '@/types/resume';

interface TailorResumeParams {
  resumeId: string;
  jobPosting: JobPosting;
  selectedSections: {
    summary: boolean;
    skills: boolean;
    experience: boolean;
    editMode: 'quick' | 'full';
  };
  selectedSkills: string[];
}

export async function tailorResume({
  resumeId,
  jobPosting,
  selectedSections,
  selectedSkills
}: TailorResumeParams): Promise<Resume> {
  try {
    // Call the tailor-resume Edge Function using the Supabase SDK
    const { data, error } = await supabase.functions.invoke('tailor-resume', {
      body: {
        resume_id: resumeId,
        job_posting: jobPosting,
        selected_sections: selectedSections,
        selected_skills: selectedSkills
      }
    });

    if (error) {
      console.error('Error invoking tailor-resume function:', error);
      throw new Error(`Failed to tailor resume: ${error.message}`);
    }

    // Check if data.success is explicitly false (function returned error but HTTP was 200)
    if (data && data.success === false) {
      console.error('Function reported error:', data.error);
      throw new Error(data.error || 'Failed to generate tailored resume');
    }

    // Validate the returned data has the expected structure
    if (!data || !data.data) {
      console.error('Invalid data structure returned from tailor-resume function:', data);
      throw new Error('Invalid data returned from tailor function');
    }

    // Return the tailored resume
    return data.data as Resume;
  } catch (error: any) {
    console.error('Exception tailoring resume:', error);
    throw new Error(`Failed to tailor resume: ${error.message || 'Unknown error'}`);
  }
}
