
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import ResumeManagement from '@/components/ResumeManagement';
import { fetchResumes } from '@/api/resumes';
import { Resume } from '@/types';

const ManageResumes = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const loadedResumes = await fetchResumes(user.id);
        setResumes(loadedResumes);
      } catch (error) {
        console.error('Failed to load resumes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResumes();
  }, [user?.id, navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Manage Resumes</h1>
        </div>
        
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Your Resumes</h2>
          <p className="text-muted-foreground mb-6">
            Upload and manage your resumes. Your primary resume will be used to automatically fill in your profile information.
          </p>
          
          <ResumeManagement 
            resumes={resumes}
            setResumes={setResumes}
            userId={user?.id}
          />
        </div>
        
        <div className="bg-secondary/30 border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">Tips for a Great Resume</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Keep your resume concise and focused on relevant experience</li>
            <li>Highlight your accomplishments with quantifiable results</li>
            <li>Tailor your resume for each job application</li>
            <li>Use keywords from the job description</li>
            <li>Proofread carefully to eliminate errors</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageResumes;
