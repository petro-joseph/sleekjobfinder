
// src/api/resumes.ts
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types';
import { uploadResumeFile } from '@/integrations/supabase/uploadResume';

export const fetchResumes = async (userId: string): Promise<Resume[]> => {
    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    return data.map(resume => ({
        id: resume.id,
        name: resume.name,
        file_path: resume.file_path,
        isPrimary: resume.is_primary,
        created_at: resume.created_at,
        updated_at: resume.updated_at,
        uploadDate: resume.upload_date ? new Date(resume.upload_date) : new Date(resume.created_at),
        user_id: resume.user_id
    })) as Resume[];
};

export const uploadResume = async (file: File): Promise<Resume> => {
    try {
        // 1. Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('User not authenticated');
        }
        const userId = user.id;

        // 2. Upload to Storage
        console.log('Uploading file:', file.name);
        const filePath = await uploadResumeFile(file, userId);
        if (!filePath) throw new Error('File upload failed');

        // 3. Get count to determine if this is the first resume
        const { count, error: countError } = await supabase
            .from('resumes')
            .select('id', { count: 'estimated' });

        if (countError) {
            console.error('Count error:', countError);
            throw new Error(countError.message);
        }

        // 4. Insert record into 'resumes' table
        const payload = {
            user_id: userId,
            name: file.name,
            file_path: filePath,
            is_primary: count === 0
        };

        const { data, error } = await supabase
            .from('resumes')
            .insert(payload)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to save resume record: ${error.message}`);
        }
        if (!data) throw new Error('Failed to save resume record');

        return {
            id: data.id,
            user_id: data.user_id,
            name: data.name,
            file_path: data.file_path,
            isPrimary: data.is_primary,
            created_at: data.created_at,
            updated_at: data.updated_at,
            uploadDate: data.upload_date ? new Date(data.upload_date) : new Date(data.created_at)
        } as Resume;
    } catch (error) {
        throw error;
    }
};

export const setPrimaryResume = async (resumeId: string, userId: string): Promise<void> => {
    // First, clear primary status from all resumes for this user
    const { error: clearError } = await supabase
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', userId);
    
    if (clearError) throw new Error(clearError.message);
    
    // Then set the selected resume as primary
    const { error } = await supabase
        .from('resumes')
        .update({ is_primary: true })
        .eq('id', resumeId)
        .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
};

export const deleteResume = async (resumeId: string, userId: string): Promise<void> => {
    // Get resume info to check if it's primary and get file path
    const { data: resume, error: fetchError } = await supabase
        .from('resumes')
        .select('file_path, is_primary')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();
    
    if (fetchError) throw new Error(fetchError.message);
    
    // Extract bucket path from the complete URL
    let storagePath = '';
    if (resume.file_path) {
        try {
            // Parse the URL to extract the path part after the bucket name
            const url = new URL(resume.file_path);
            // The path will be something like /storage/v1/object/public/cv-bucket/userId/filename
            const pathParts = url.pathname.split('/');
            // Find the bucket name index and extract the path after it
            const bucketIndex = pathParts.indexOf('cv-bucket');
            if (bucketIndex !== -1) {
                storagePath = pathParts.slice(bucketIndex + 1).join('/');
            }
        } catch (e) {
            console.error('Error extracting storage path:', e);
        }
    }
    
    // Delete the database record
    const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    // If this was the primary resume, set another one as primary if available
    if (resume.is_primary) {
        const { data: remainingResumes, error: listError } = await supabase
            .from('resumes')
            .select('id')
            .eq('user_id', userId)
            .limit(1);
        
        if (!listError && remainingResumes?.length > 0) {
            await setPrimaryResume(remainingResumes[0].id, userId);
        }
    }
    
    // Delete the file from storage bucket
    if (storagePath) {
        const { error: storageError } = await supabase.storage
            .from('cv-bucket')
            .remove([storagePath]);
            
        if (storageError) {
            console.error('Error deleting file from storage:', storageError);
            // We don't throw here as the database record is already deleted
        }
    }
};

export const updateResumeName = async (resumeId: string, name: string, userId: string): Promise<Resume> => {
    const { data, error } = await supabase
        .from('resumes')
        .update({ name })
        .eq('id', resumeId)
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    
    return {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        file_path: data.file_path,
        isPrimary: data.is_primary,
        created_at: data.created_at,
        updated_at: data.updated_at,
        uploadDate: data.upload_date ? new Date(data.upload_date) : new Date(data.created_at)
    } as Resume;
};
