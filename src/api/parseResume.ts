
import { supabase } from '@/integrations/supabase/client';
import { ParsedResumeDbData } from '@/supabase/functions/parse-resume-and-store/interfaces/resume';

export interface ParseResumeResponse {
  success: boolean;
  parsed_data?: ParsedResumeDbData;
  error?: string;
}

/**
 * Calls the parse-resume-and-store Edge Function with the resume ID
 * @param resumeId The ID of the resume to parse
 * @returns The parsed resume data
 */
export const parseResume = async (resumeId: string): Promise<ParseResumeResponse> => {
  try {
    // Call the Edge Function with the resume ID
    const { data, error } = await supabase.functions.invoke('parse-resume-and-store', {
      body: { resume_id: resumeId },
    });

    if (error) {
      console.error('Error invoking parse-resume-and-store function:', error);
      return { 
        success: false, 
        error: `Failed to parse resume: ${error.message || 'Unknown error'}` 
      };
    }

    // Return the successfully parsed data
    return { 
      success: true, 
      parsed_data: data?.parsed_data as ParsedResumeDbData 
    };
  } catch (error: any) {
    console.error('Exception calling parse-resume-and-store function:', error);
    return { 
      success: false, 
      error: `Exception parsing resume: ${error.message || 'Unknown error'}` 
    };
  }
};
