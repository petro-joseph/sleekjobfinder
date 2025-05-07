
// src/integrations/supabase/uploadResume.ts
import { supabase } from "./client";

/**
 * Uploads a resume file to Supabase storage and returns its public URL
 * 
 * @param file The resume file to upload (PDF, DOCX, or TXT)
 * @param userId The user ID to associate with this file
 * @returns The public URL of the uploaded file
 */
export async function uploadResumeFile(file: File, userId: string): Promise<string> {
  try {
    // Create a sanitized file name
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const sanitizedFileName = `${timestamp}_resume.${fileExtension}`;
    const fileName = `${userId}/${sanitizedFileName}`;

    // Skip bucket check - assume bucket exists since we've created it
    console.log('Uploading file to bucket "cv-bucket" with path:', fileName);
    
    const { data, error } = await supabase.storage
      .from("cv-bucket")
      .upload(fileName, file, { 
        cacheControl: '3600', 
        upsert: false,
        contentType: file.type // Explicitly set the content type
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage.from("cv-bucket").getPublicUrl(fileName);
    if (!publicUrlData?.publicUrl) {
      console.error('No public URL returned');
      throw new Error('No public URL');
    }
    
    console.log('File uploaded successfully, public URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadResumeFile:', error);
    throw error;
  }
}

/**
 * Extract storage path from a Supabase URL
 * This is useful when deleting files from storage
 * 
 * @param url The Supabase storage URL
 * @returns The storage path without the bucket name
 */
export function extractStoragePath(url: string): string | null {
  if (!url) return null;
  
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
    
    // Fallback: try to extract from the object path format
    // Format: /storage/v1/object/public/cv-bucket/path/to/file
    const objectIndex = pathParts.findIndex(part => part === 'object');
    if (objectIndex !== -1 && pathParts[objectIndex + 1] === 'public' && pathParts[objectIndex + 2] === 'cv-bucket') {
      return pathParts.slice(objectIndex + 3).join('/');
    }
    
    return null;
  } catch (e) {
    console.error('Failed to extract storage path:', e);
    return null;
  }
}
