// src/api/resumes.ts
import { supabase } from "@/integrations/supabase/client";
import { Resume } from '@/types';
import { uploadResumeFile } from '@/integrations/supabase/uploadResume';
import { ParsedResumeDbData } from '@/types/parsedResume'; 
import { parseResume } from './parseResume';

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

export const uploadResume = async (file: File): Promise<Resume> => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('User not authenticated');
        const userId = user.id;

        console.log('Uploading file:', file.name);
        // uploadResumeFile should return the full public URL now if your DB expects it
        const publicUrlPath = await uploadResumeFile(file, userId); // Ensure this returns the PUBLIC URL
        if (!publicUrlPath) throw new Error('File upload failed');

        const { count, error: countError } = await supabase
            .from('resumes')
            .select('id', { count: 'estimated', head: true }) // Use head:true for faster count
            .eq('user_id', userId); // Count only for the current user

        if (countError) {
            console.error('Count error:', countError);
            throw new Error(countError.message);
        }

        const payload = {
            user_id: userId,
            name: file.name, // Original file name
            file_path: publicUrlPath, // Store the public URL
            is_primary: (count || 0) === 0, // Make first resume primary for the user
            file_size: file.size, // Add file size
            upload_date: new Date().toISOString(), // Add upload date
        };

        const { data, error } = await supabase
            .from('resumes')
            .insert(payload)
            .select()
            .single();

        if (error) throw new Error(`Failed to save resume record: ${error.message}`);
        if (!data) throw new Error('Failed to save resume record');

        // Create a resume object for return
        const newResume = {
            id: data.id,
            name: data.name,
            file_path: data.file_path,
            isPrimary: data.is_primary,
            created_at: data.created_at,
            updated_at: data.updated_at,
            uploadDate: data.upload_date ? new Date(data.upload_date) : new Date(data.created_at),
            user_id: data.user_id
        } as Resume;

        // Trigger resume parsing in the background
        parseResume(data.id)
            .then(response => {
                if (!response.success) {
                    console.error('Background parsing failed:', response.error);
                } else {
                    console.log('Resume parsed successfully in background');
                }
            })
            .catch(parseError => {
                console.error('Error in background parsing:', parseError);
            });

        return newResume;
    } catch (error) {
        console.error('UploadResume Error:', error);
        throw error;
    }
};

// New function to fetch parsed data and update profile
export const applyPrimaryResumeDataToProfile = async (userId: string, resumeId: string): Promise<void> => {
    // 1. Fetch the parsed_data for the given resumeId
    const { data: resumeData, error: fetchError } = await supabase
        .from('resumes')
        .select('parsed_data')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !resumeData || !resumeData.parsed_data) {
        throw new Error(`Failed to fetch parsed data for resume ${resumeId}: ${fetchError?.message || 'No data'}`);
    }

    // Cast the parsed_data to ParsedResumeDbData with type assertion
    const parsed = resumeData.parsed_data as ParsedResumeDbData;

    if (parsed.parser_used === 'failed' || parsed.parser_used === 'unsupported_format' || !parsed.personal) {
        console.warn(`Resume ${resumeId} was not successfully parsed or has no personal data. Skipping profile update.`);
        // Optionally, toast a message to the user
        return;
    }

    // 2. Map ParsedResumeDbData to the structure your ProfilePage expects
    //    and then update the `profiles` table.
    //    This mapping is CRUCIAL and depends on your `profileData` state in `ProfilePage.tsx`
    //    and the structure of `profiles` table columns (e.g., `linkedin`, `employment`, `skills` arrays).

    const profileUpdatePayload: any = {};

    // Personal Info (assuming profiles table has these columns, or a jsonb column)
    if (parsed.personal) {
        // Example: if your profiles table has `first_name`, `last_name`
        if (parsed.personal.full_name) {
            const nameParts = parsed.personal.full_name.split(' ');
            profileUpdatePayload.first_name = nameParts.shift() || null;
            profileUpdatePayload.last_name = nameParts.join(' ') || null;
        }
        profileUpdatePayload.email = parsed.personal.email || undefined; // Use undefined to not update if null
        profileUpdatePayload.phone_number = parsed.personal.phone || undefined;
        profileUpdatePayload.linkedin_url = parsed.personal.linkedin_url || undefined;
        profileUpdatePayload.website_url = parsed.personal.website || undefined;
        profileUpdatePayload.location = parsed.personal.location_string || undefined;
        profileUpdatePayload.bio = parsed.personal.summary_bio || undefined;
        // Add other direct profile fields...
    }

    // Skills
    if (parsed.skills && parsed.skills.length > 0) {
        profileUpdatePayload.skills = parsed.skills; // Assuming `profiles.skills` is text[]
    }

    // Update profiles table
    if (Object.keys(profileUpdatePayload).length > 0) {
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update(profileUpdatePayload)
            .eq('id', userId);

        if (profileUpdateError) {
            throw new Error(`Failed to update profile with parsed data: ${profileUpdateError.message}`);
        }
    }

    // Handle Experiences (insert into `experiences` table)
    if (parsed.experience && parsed.experience.length > 0) {
        // Optional: Delete old experiences for this user before inserting new ones
        // await supabase.from('experiences').delete().eq('user_id', userId);

        const experiencesToInsert = parsed.experience.map(exp => ({
            user_id: userId,
            title: exp.title || '',        // Maps to the 'title' column in experiences table
            company: exp.company || '',    // Maps to the 'company' column in experiences table
            location: exp.location,
            start_date: exp.start_date,
            end_date: exp.end_date,
            summary: exp.summary,
            description: exp.achievements.join('\n- '), // Match EditModal format
            job_type: exp.job_type,
        }));
        
        const { error: expError } = await supabase
            .from('experiences')
            .upsert(experiencesToInsert, { onConflict: 'user_id, title, company' });
            
        if (expError) console.warn("Error inserting experiences:", expError.message);
    }

    // Handle Education (insert into `education` table)
    if (parsed.education && parsed.education.length > 0) {
        // Optional: Delete old education for this user
        // await supabase.from('education').delete().eq('user_id', userId);

        const educationToInsert = parsed.education.map(edu => ({
            user_id: userId,
            school: edu.institution || '',      // Maps to the 'school' column in education table
            degree: edu.degree || '',
            field_of_study: edu.field_of_study,
            start_date: edu.start_date,
            end_date: edu.end_date,
            description: edu.description,
        }));
        
        const { error: eduError } = await supabase
            .from('education')
            .upsert(educationToInsert, { onConflict: 'user_id, school, degree' });
            
        if (eduError) console.warn("Error inserting education:", eduError.message);
    }

    console.log(`Profile and related data for user ${userId} updated from resume ${resumeId}`);
};

// Modify setPrimaryResume to call applyPrimaryResumeDataToProfile
export const setPrimaryResume = async (resumeId: string, userId: string): Promise<void> => {
    // Your existing logic to update is_primary in DB (triggers will handle profiles.primary_cv_id)
    // This can be simplified if your SQL trigger `ensure_single_primary_resume` correctly
    // updates `profiles.primary_cv_id`. The client doesn't need to clear all then set one.
    // Just set the new one to primary.
    const { error } = await supabase
        .from('resumes')
        .update({ is_primary: true }) // The trigger will set others to false
        .eq('id', resumeId)
        .eq('user_id', userId);

    if (error) throw new Error(error.message);

    // After successfully setting primary in DB, apply its parsed data to the profile
    try {
        await applyPrimaryResumeDataToProfile(userId, resumeId);
        // Optionally toast success
    } catch (applyError) {
        console.error('Error applying primary resume data to profile:', applyError);
        // Optionally toast an error to the user, but the resume is still primary
        // throw applyError; // Or handle more gracefully
    }
};

// New function to get the parsed data for a resume
export const getResumeWithParsedData = async (resumeId: string): Promise<{resume: Resume, parsedData: ParsedResumeDbData | null}> => {
    const { data: resumeData, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();
        
    if (error) throw new Error(`Failed to fetch resume: ${error.message}`);
    
    // Create resume object
    const resume = {
        id: resumeData.id,
        name: resumeData.name,
        file_path: resumeData.file_path,
        isPrimary: resumeData.is_primary,
        created_at: resumeData.created_at,
        updated_at: resumeData.updated_at,
        uploadDate: resumeData.upload_date ? new Date(resumeData.upload_date) : new Date(resumeData.created_at),
        user_id: resumeData.user_id
    } as Resume;
    
    // Get parsed data if available - use proper type assertion
    const parsedData = resumeData.parsed_data as ParsedResumeDbData | null;
    
    return { resume, parsedData };
};

// Force a resume to be parsed (or re-parsed) on demand
export const forceParseResume = async (resumeId: string): Promise<ParsedResumeDbData | null> => {
    try {
        const response = await parseResume(resumeId);
        
        if (!response.success || !response.parsed_data) {
            throw new Error(response.error || 'Failed to parse resume');
        }
        
        return response.parsed_data;
    } catch (error) {
        console.error('Force parse resume error:', error);
        throw error;
    }
};
