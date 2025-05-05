
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

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage.from("cv-bucket").getPublicUrl(fileName);
    if (!publicUrlData?.publicUrl) throw new Error('No public URL');
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadResumeFile:', error);
    throw error;
  }
}

/**
 * Extract storage path from a Supabase URL
 * This is useful when deleting files from storage
 */
export function extractStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Look for the bucket name in the path
    const bucketNameIndex = pathParts.indexOf('cv-bucket');
    if (bucketNameIndex !== -1 && bucketNameIndex < pathParts.length - 1) {
      // Return everything after the bucket name
      return pathParts.slice(bucketNameIndex + 1).join('/');
    }
    return null;
  } catch (e) {
    console.error('Failed to extract storage path:', e);
    return null;
  }
}
