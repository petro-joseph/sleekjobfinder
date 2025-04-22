
// File: src/integrations/supabase/uploadResume.ts
import { supabase } from "./client";

/** 
 * Upload a resume file to Supabase Storage and return the public URL/path 
 */
export async function uploadResumeFile(file: File, userId: string): Promise<string | null> {
  const fileName = `${userId}/${Date.now()}_${encodeURIComponent(file.name)}`;

  // Upload to "cv-bucket" instead of "resumes"
  const { data, error } = await supabase.storage
    .from("cv-bucket")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  // Get the public URL for the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from("cv-bucket")
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl || null;
}
