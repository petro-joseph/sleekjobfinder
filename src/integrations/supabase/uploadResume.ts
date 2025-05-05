
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
    
    // Improved path extraction logic
    // Look for "cv-bucket" in the path
    const bucketIndex = pathParts.findIndex(part => part === 'cv-bucket');
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      // Get all parts after the bucket name
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  } catch (e) {
    console.error('Failed to extract storage path:', e);
    return null;
  }
}
