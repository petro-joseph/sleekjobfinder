// src/integrations/supabase/uploadResume.ts
import { supabase } from "./client";

export async function uploadResumeFile(file: File, userId: string): Promise<string> {
  try {
    const fileName = `${userId}/${Date.now()}_${encodeURIComponent(file.name)}`;

    const { data, error } = await supabase.storage
      .from("cv-bucket")
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from("cv-bucket").getPublicUrl(fileName);
    if (!publicUrlData?.publicUrl) throw new Error('No public URL');
    return publicUrlData.publicUrl;
  } catch (error) {
    throw error;
  }
}