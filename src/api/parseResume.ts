
import { supabase } from '@/integrations/supabase/client';
import { ParsedResumeDbData } from '@/types/parsedResume';

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

    // Check if data.success is explicitly false (function returned error but HTTP was 200)
    if (data && data.success === false) {
      console.error('Function reported error:', data.error);
      return {
        success: false,
        error: data.error || 'Function reported failure without specific error'
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
