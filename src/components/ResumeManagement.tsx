import React, { useState } from 'react';
import { Resume } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ResumeManagementProps {
  resumes: Resume[];
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>;
  userId?: string;
}

/**
 * ResumeManagement component allows users to upload, delete, and set primary resumes.
 * It handles all resume-related operations and displays a list of uploaded resumes.
 *
 * @param {Resume[]} resumes - Array of uploaded resumes.
 * @param {function} setResumes - Function to update the resumes state.
 * @param {string} userId - User ID for authentication.
 */
const ResumeManagement: React.FC<ResumeManagementProps> = ({
  resumes,
  setResumes,
  userId,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    if (resumes.length >= 3) {
      toast.error('Maximum 3 resumes allowed');
      return;
    }

    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const { data: resumeData, error: dbError } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          name: file.name,
          file_path: publicUrl,
          is_primary: resumes.length === 0,
          upload_date: new Date().toISOString(),
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setResumes(prev => [...prev, {
        id: resumeData.id,
        name: resumeData.name,
        file_path: resumeData.file_path,
        isPrimary: resumeData.is_primary,
        created_at: resumeData.created_at,
        updated_at: resumeData.updated_at,
        uploadDate: resumeData.upload_date || resumeData.created_at,
      }]);
      toast.success('Resume uploaded');
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;

      setResumes(prev => {
        const updated = prev.filter(resume => resume.id !== id);
        if (prev.find(r => r.id === id)?.isPrimary && updated.length > 0) {
          updated[0].isPrimary = true;
          supabase.from('resumes').update({ is_primary: true }).eq('id', updated[0].id);
        }
        return updated;
      });

      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const handleSetPrimaryResume = async (id: string) => {
    try {
      if (!userId) throw new Error('User not authenticated');

      await supabase.from('resumes').update({ is_primary: false }).eq('user_id', userId);
      await supabase.from('resumes').update({ is_primary: true }).eq('id', id);

      setResumes(prev => prev.map(resume => ({
        ...resume,
        isPrimary: resume.id === id,
      })));

      toast.success('Primary resume updated');
    } catch (error) {
      toast.error('Failed to update primary resume');
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Input
          type="file"
          accept=".pdf"
          id="resume-upload"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading || resumes.length >= 3}
        />
        <Label
          htmlFor="resume-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">
            {uploading ? 'Uploading...' : 'Click to upload your resume (PDF only)'}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            Maximum 3 resumes, 5MB each
          </span>
        </Label>
      </div>

      <div className="space-y-2">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="flex items-center justify-between p-3 border rounded-lg bg-background/50"
          >
            <div className="flex items-center">
              <div className="mr-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  PDF
                </div>
              </div>
              <div>
                <div className="font-medium">{resume.name}</div>
                <div className="text-xs text-muted-foreground">
                  Uploaded {typeof resume.uploadDate === 'string'
                    ? new Date(resume.uploadDate).toLocaleDateString()
                    : resume.uploadDate?.toLocaleDateString() ||
                    new Date(resume.created_at || "").toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {resume.isPrimary ? (
                <Badge className="mr-2" variant="secondary">Primary</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 text-xs h-8"
                  onClick={() => handleSetPrimaryResume(resume.id)}
                >
                  Set as Primary
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDeleteResume(resume.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeManagement;