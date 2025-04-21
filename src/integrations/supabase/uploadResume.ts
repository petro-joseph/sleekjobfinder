
import { supabase } from "./client";

/** Upload a resume file to Supabase Storage and return the public URL/path */
export async function uploadResumeFile(file: File, userId: string): Promise<string | null> {
  const fileName = `${userId}/${Date.now()}_${encodeURIComponent(file.name)}`;
  const { data, error } = await supabase.storage.from("resumes").upload(fileName, file);

  if (error) {
    throw error;
  }

  // Optionally, construct a public URL if Bucket is public, or use the file path with access
  // (adjust as needed)
  return data?.path || fileName;
}
