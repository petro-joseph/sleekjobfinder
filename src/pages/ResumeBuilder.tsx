
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, FileText, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { useAuthStore } from '../lib/store';
import { Resume } from '../types/resume';
import { ResumeCreationFlow } from '../components/resume-builder/ResumeCreationFlow';
import { ResumeTailoringFlow } from '../components/resume-builder/ResumeTailoringFlow';

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'select' | 'create' | 'tailor'>('select');
  const { user } = useAuthStore();
  
  // Reset mode when navigating away
  useEffect(() => {
    return () => setMode('select');
  }, []);

  const handleResumeComplete = (resume: Resume) => {
    toast({
      title: "Resume created successfully!",
      description: "Your new resume has been saved.",
    });
    // In a real app, save resume to user's profile
    setMode('select');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
        </div>

        {mode === 'select' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Resume
                </CardTitle>
                <CardDescription>
                  Build a professional resume from scratch with our step-by-step guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setMode('create')}
                  className="w-full"
                >
                  Start Fresh <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tailor Existing Resume
                </CardTitle>
                <CardDescription>
                  Optimize your existing resume for specific job opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setMode('tailor')}
                  variant="outline" 
                  className="w-full"
                >
                  Customize Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === 'create' && (
          <ResumeCreationFlow 
            onBack={() => setMode('select')}
            onComplete={handleResumeComplete}
          />
        )}

        {mode === 'tailor' && (
          <ResumeTailoringFlow onClose={() => setMode('select')} />
        )}
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
