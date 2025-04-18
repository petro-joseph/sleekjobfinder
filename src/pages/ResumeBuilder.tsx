
import { useState, useEffect } from 'react';
import { ArrowRight, Upload, FileText, Download, Check, X, ChevronLeft, ChevronRight, Edit, Trash2, Plus, Minus, ThumbsUp, ThumbsDown } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionHeading } from '@/components/ui/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store';
import { ResumeAnalysisStep } from '@/components/resume-builder/ResumeAnalysisStep';
import { ResumeCustomizationStep } from '@/components/resume-builder/ResumeCustomizationStep';
import { ResumePreviewStep } from '@/components/resume-builder/ResumePreviewStep';
import { defaultResume, defaultJobPosting } from '@/data/resume-data';
import { Resume, JobPosting, MatchData } from '@/types/resume';

const ResumeBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('upload');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [optimized, setOptimized] = useState(false);
  const [credits, setCredits] = useState(4);
  
  // Resume tailoring state
  const [resume, setResume] = useState<Resume>(defaultResume);
  const [jobPosting, setJobPosting] = useState<JobPosting>(defaultJobPosting);
  const [matchData, setMatchData] = useState<MatchData>({
    initialScore: 4.5,
    finalScore: 0,
    titleMatch: false,
    experienceMatch: false,
    industryMatches: [],
    skillMatches: [],
    missingSkills: [],
    summaryMatch: false
  });
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    skills: true,
    experience: true,
    editMode: 'quick' // 'quick' or 'full'
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [tailoredResume, setTailoredResume] = useState<Resume | null>(null);
  const [template, setTemplate] = useState('standard'); // 'standard' or 'compact'

  // Original implementation for file upload
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

  // Analyze resume against job posting
  useEffect(() => {
    // Only run analysis when we have both resume and job posting data
    if (resume && jobPosting) {
      // Analyze title match
      const titleMatch = resume.jobTitle.toLowerCase().includes(jobPosting.title.toLowerCase()) ||
                        jobPosting.title.toLowerCase().includes(resume.jobTitle.toLowerCase());
      
      // Analyze experience match
      const experienceMatch = resume.yearsOfExperience >= jobPosting.requiredYearsOfExperience;
      
      // Analyze industry matches
      const industryMatches = resume.industries.filter(ind => 
        jobPosting.industries.includes(ind));
      
      // Analyze skill matches
      const skillMatches = resume.skills.filter(skill => 
        jobPosting.requiredSkills.includes(skill));
      
      // Find missing skills
      const missingSkills = jobPosting.requiredSkills.filter(skill => 
        !resume.skills.includes(skill));
      
      // Calculate match score (simplified)
      const skillScore = (skillMatches.length / jobPosting.requiredSkills.length) * 5;
      const expScore = experienceMatch ? 2 : 1;
      const titleScore = titleMatch ? 2 : 1;
      const industryScore = (industryMatches.length / jobPosting.industries.length) * 1;
      
      const initialScore = Math.min(10, skillScore + expScore + titleScore + industryScore);
      
      setMatchData({
        initialScore: parseFloat(initialScore.toFixed(1)),
        finalScore: 0, // Will be set when tailored
        titleMatch,
        experienceMatch,
        industryMatches,
        skillMatches,
        missingSkills,
        summaryMatch: false // Assume summary needs improvement
      });
    }
  }, [resume, jobPosting]);

  // Generate tailored resume
  const generateTailoredResume = () => {
    if (selectedSections.summary || selectedSections.skills || selectedSections.experience) {
      setIsOptimizing(true);
      
      // Simulate processing time
      setTimeout(() => {
        // Create a deep copy of the original resume
        const tailored = JSON.parse(JSON.stringify(resume)) as Resume;
        
        // Enhance summary if selected
        if (selectedSections.summary) {
          tailored.summary = `Experienced ${jobPosting.title} with ${resume.yearsOfExperience} years of expertise in ${jobPosting.industries.join(', ')}. Proven track record of delivering ${jobPosting.requiredSkills.slice(0, 3).join(', ')} solutions. Seeking to leverage my skills in ${selectedSkills.join(', ')} to drive innovation at ${jobPosting.company}.`;
        }
        
        // Add selected skills if skills section is selected
        if (selectedSections.skills) {
          tailored.skills = [...resume.skills, ...selectedSkills];
        }
        
        // Enhance work experience if selected
        if (selectedSections.experience) {
          const numExperiencesToEnhance = selectedSections.editMode === 'quick' ? 2 : tailored.workExperiences.length;
          
          for (let i = 0; i < numExperiencesToEnhance; i++) {
            if (tailored.workExperiences[i]) {
              // Add job-specific keywords to responsibilities
              const enhancedResponsibilities = tailored.workExperiences[i].responsibilities.map(resp => {
                // Replace 10% of responsibilities with enhanced ones
                if (Math.random() > 0.9) {
                  return `Led initiatives utilizing ${jobPosting.requiredSkills[Math.floor(Math.random() * jobPosting.requiredSkills.length)]} to improve business processes and deliver results.`;
                }
                return resp;
              });
              
              // Add a new responsibility that mentions job skills
              if (jobPosting.requiredSkills.length > 0) {
                enhancedResponsibilities.push(`Implemented solutions using ${jobPosting.requiredSkills.slice(0, 3).join(', ')} to solve complex business challenges.`);
              }
              
              tailored.workExperiences[i].responsibilities = enhancedResponsibilities;
            }
          }
        }
        
        // Calculate new match score
        const newSkillScore = ((matchData.skillMatches.length + selectedSkills.length) / jobPosting.requiredSkills.length) * 5;
        const summaryScore = selectedSections.summary ? 2 : 1;
        const experienceScore = (selectedSections.experience ? 2 : 1) + (matchData.experienceMatch ? 1 : 0);
        
        const finalScore = Math.min(10, newSkillScore + summaryScore + experienceScore);
        
        // Update match data with final score
        setMatchData(prev => ({
          ...prev,
          finalScore: parseFloat(finalScore.toFixed(1)),
          summaryMatch: selectedSections.summary
        }));
        
        // Set tailored resume
        setTailoredResume(tailored);
        
        // Deduct a credit
        setCredits(prev => prev - 1);
        
        // Complete optimization
        setIsOptimizing(false);
        setCurrentStep(3);
        
        toast({
          title: "Resume tailored successfully!",
          description: "Your resume has been customized for this job.",
        });
      }, 2000);
    } else {
      toast({
        title: "No sections selected",
        description: "Please select at least one section to enhance.",
        variant: "destructive"
      });
    }
  };

  // Reset the process
  const resetProcess = () => {
    setCurrentStep(1);
    setSelectedSkills([]);
    setTailoredResume(null);
    setSelectedSections({
      summary: true,
      skills: true,
      experience: true,
      editMode: 'quick'
    });
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle feedback
  const handleFeedback = (positive: boolean) => {
    if (positive) {
      toast({
        title: "Thanks for your feedback!",
        description: "We're glad you like your tailored resume.",
      });
    } else {
      toast({
        title: "We're sorry to hear that",
        description: "Please tell us how we can improve.",
      });
    }
  };

  // Determine which step component to render
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ResumeAnalysisStep 
            resume={resume}
            jobPosting={jobPosting}
            matchData={matchData}
            onContinue={goToNextStep}
            userResumes={user?.resumes || []}
          />
        );
      case 2:
        return (
          <ResumeCustomizationStep 
            matchData={matchData}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            onGenerate={generateTailoredResume}
            isGenerating={isOptimizing}
          />
        );
      case 3:
        return tailoredResume ? (
          <ResumePreviewStep 
            originalResume={resume}
            tailoredResume={tailoredResume}
            setTailoredResume={setTailoredResume}
            matchData={matchData}
            selectedSkills={selectedSkills}
            template={template}
            setTemplate={setTemplate}
            onFeedback={handleFeedback}
            credits={credits}
          />
        ) : (
          <div className="text-center p-12">
            <h3 className="text-xl font-medium mb-4">Generating your tailored resume...</h3>
            <div className="loader mx-auto"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={resetProcess}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <h1 className="text-2xl font-bold text-center">Generate Your Custom Resume</h1>
          
          <div className="text-sm text-muted-foreground">
            {credits} credits available today
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 max-w-2xl mx-auto">
          {[
            { num: 1, title: "See Your Difference" },
            { num: 2, title: "Align Your Resume" },
            { num: 3, title: "Review Your New Resume" }
          ].map((step) => (
            <button
              key={step.num}
              onClick={() => step.num <= currentStep && setCurrentStep(step.num)}
              className={`flex flex-col items-center ${step.num <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.num === currentStep 
                    ? 'bg-green-500 text-white' 
                    : step.num < currentStep 
                      ? 'bg-green-100 text-green-500' 
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step.num < currentStep ? <Check className="h-5 w-5" /> : step.num}
              </div>
              <span className={`text-xs text-center ${step.num === currentStep ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </button>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
