
import { useState } from 'react';
import { ArrowRight, Upload, FileText, Download, Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionHeading } from '@/components/ui/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [optimized, setOptimized] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleOptimize = () => {
    if (!fileName) {
      toast({
        title: "No resume uploaded",
        description: "Please upload a resume file first.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimized(true);
      toast({
        title: "Resume optimized!",
        description: "Your resume has been tailored for maximum impact.",
      });
    }, 2000);
  };

  const handleDownload = () => {
    if (!optimized) {
      toast({
        title: "No optimized resume",
        description: "Please optimize your resume first.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Downloading resume",
      description: "Your optimized resume is downloading...",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SectionHeading
          title="AI Resume Builder"
          subtitle="Upload your resume and let our AI optimize it for your target jobs. Get more interviews with a tailored resume that highlights your most relevant skills and experience."
        />

        <div className="max-w-4xl mx-auto mt-10">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upload" onClick={() => setActiveTab('upload')}>Upload Resume</TabsTrigger>
              <TabsTrigger value="optimize" onClick={() => setActiveTab('optimize')}>Optimize</TabsTrigger>
              <TabsTrigger value="download" onClick={() => setActiveTab('download')}>Download</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Drag and drop your resume file here, or click to select a file.
                        We accept PDF, DOCX, and TXT formats.
                      </p>

                      <div className="relative">
                        <Input
                          type="file"
                          id="resume-upload"
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileChange}
                        />
                        <Button variant="outline" className="relative pointer-events-none">
                          <Upload className="mr-2 h-4 w-4" />
                          Select File
                        </Button>
                      </div>

                      {fileName && (
                        <div className="mt-4 flex items-center text-sm text-foreground">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          <span>{fileName} uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setActiveTab('optimize')}>
                      Continue to Optimize 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimize" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Target Job Details</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="job-title">Job Title</Label>
                          <Input id="job-title" placeholder="e.g. Frontend Developer" />
                        </div>
                        <div>
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input id="company" placeholder="e.g. Google" />
                        </div>
                        <div>
                          <Label htmlFor="key-skills">Key Skills</Label>
                          <Input id="key-skills" placeholder="e.g. React, TypeScript, Node.js" />
                        </div>
                        <div>
                          <Label htmlFor="job-description">Job Description</Label>
                          <Textarea 
                            id="job-description" 
                            placeholder="Paste the job description here..."
                            rows={5}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Optimization Options</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" id="keywords" className="mt-1" defaultChecked />
                          <div>
                            <Label htmlFor="keywords">ATS Keyword Optimization</Label>
                            <p className="text-sm text-muted-foreground">
                              Enhance your resume with relevant keywords from the job description
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" id="layout" className="mt-1" defaultChecked />
                          <div>
                            <Label htmlFor="layout">Layout Optimization</Label>
                            <p className="text-sm text-muted-foreground">
                              Improve readability with professional formatting
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" id="achievements" className="mt-1" defaultChecked />
                          <div>
                            <Label htmlFor="achievements">Achievements Focus</Label>
                            <p className="text-sm text-muted-foreground">
                              Highlight quantifiable achievements and results
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" id="language" className="mt-1" defaultChecked />
                          <div>
                            <Label htmlFor="language">Language Enhancement</Label>
                            <p className="text-sm text-muted-foreground">
                              Improve language and use powerful action verbs
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleOptimize} 
                      disabled={isOptimizing || !fileName}
                      className="min-w-[150px]"
                    >
                      {isOptimizing ? (
                        <>
                          <div className="loader mr-2" />
                          Optimizing...
                        </>
                      ) : (
                        'Optimize Resume'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="download" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center max-w-lg mx-auto">
                    {optimized ? (
                      <>
                        <div className="bg-green-500/10 p-4 rounded-full inline-flex items-center justify-center mb-4">
                          <Check className="h-10 w-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Resume Optimization Complete!</h3>
                        <p className="text-muted-foreground mb-6">
                          Your resume has been optimized for your target job. It now has a higher chance of passing ATS systems and impressing hiring managers.
                        </p>
                        <Button onClick={handleDownload} className="mb-4 w-full sm:w-auto">
                          <Download className="mr-2 h-4 w-4" />
                          Download Optimized Resume
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          You can download your resume in PDF, DOCX, or TXT format.
                        </p>
                      </>
                    ) : (
                      <>
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Optimized Resume Yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Please upload your resume and complete the optimization process to download an optimized version.
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab('upload')}>
                          Go to Upload
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
