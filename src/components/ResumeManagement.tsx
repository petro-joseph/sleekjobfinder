
import React, { useState } from 'react';
import { Resume } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { uploadResume, deleteResume, setPrimaryResume, forceParseResume } from '@/api/resumes';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);
  const [parsingId, setParsingId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    // Accept PDF, DOCX, or TXT files
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    
    if (resumes.length >= 3) {
      toast.error('Maximum 3 resumes allowed');
      return;
    }

    try {
      setUploading(true);
      
      const newResume = await uploadResume(file);
      
      setResumes(prev => [...prev, newResume]);
      toast.success('Resume uploaded successfully!', {
        description: 'Your resume is being processed in the background.'
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      setDeletingId(id);
      
      await deleteResume(id, userId);
      
      setResumes(prev => {
        const updated = prev.filter(resume => resume.id !== id);
        return updated;
      });

      toast.success('Resume deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimaryResume = async (id: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      setSettingPrimaryId(id);
      
      await setPrimaryResume(id, userId);

      setResumes(prev => prev.map(resume => ({
        ...resume,
        isPrimary: resume.id === id,
      })));

      toast.success('Primary resume updated');
    } catch (error) {
      console.error('Primary update error:', error);
      toast.error('Failed to update primary resume');
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const handleForceReparse = async (id: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      setParsingId(id);
      
      await forceParseResume(id);

      toast.success('Resume reparsed successfully');
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Failed to parse resume');
    } finally {
      setParsingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Input
          type="file"
          accept=".pdf,.docx,.txt"
          id="resume-upload"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading || resumes.length >= 3}
        />
        <Label
          htmlFor="resume-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 mb-2 text-primary animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                Click to upload your resume (PDF, DOCX, or TXT)
              </span>
            </>
          )}
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
                  {resume.name.toLowerCase().endsWith('.pdf') ? 'PDF' :
                   resume.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'TXT'}
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
              {parsingId === resume.id ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 text-xs h-8"
                  disabled
                >
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Parsing...
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 text-xs h-8"
                  onClick={() => handleForceReparse(resume.id)}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reparse
                </Button>
              )}
              
              {resume.isPrimary ? (
                <Badge className="mr-2" variant="secondary">Primary</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 text-xs h-8"
                  onClick={() => handleSetPrimaryResume(resume.id)}
                  disabled={settingPrimaryId === resume.id}
                >
                  {settingPrimaryId === resume.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Set as Primary
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDeleteResume(resume.id)}
                disabled={deletingId === resume.id}
              >
                {deletingId === resume.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeManagement;
