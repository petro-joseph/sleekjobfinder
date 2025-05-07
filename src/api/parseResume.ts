
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
    console.log(`Calling parse-resume-and-store Edge Function for resume ID: ${resumeId}`);
    
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

    // Validate the returned data has the expected structure
    if (!data || !data.parsed_data) {
      console.error('Invalid data structure returned from parse-resume-and-store function');
      return {
        success: false,
        error: 'Invalid data returned from parse function'
      };
    }

    // Type casting with validation
    const parsedData = data.parsed_data as unknown;
    
    // Validate the data structure conforms to ParsedResumeDbData
    function isValidParsedData(data: unknown): data is ParsedResumeDbData {
      if (!data || typeof data !== 'object') return false;
      
      const d = data as Record<string, unknown>;
      return (
        'parser_used' in d &&
        'parsed_at' in d &&
        'personal' in d &&
        'education' in d &&
        'experience' in d &&
        'skills' in d &&
        Array.isArray(d.skills)
      );
    }
    
    // Safely cast to ParsedResumeDbData if valid
    if (isValidParsedData(parsedData)) {
      // Return the successfully parsed data
      return { 
        success: true, 
        parsed_data: parsedData
      };
    } else {
      console.error('Invalid parsed data structure:', parsedData);
      return {
        success: false,
        error: 'Invalid parsed resume data structure'
      };
    }
  } catch (error: any) {
    console.error('Exception calling parse-resume-and-store function:', error);
    return { 
      success: false, 
      error: `Exception parsing resume: ${error.message || 'Unknown error'}` 
    };
  }
};
