
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Import React
// Import necessary icons
import { Check, X, Info, ArrowRight, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../ui/button'; // Adjusted path
import { useToast } from '../../hooks/use-toast'; // Adjusted path
import { useAuthStore } from '../../lib/store'; // Adjusted path
import { ResumeAnalysisStep } from './ResumeAnalysisStep'; // Adjusted path
import { ResumeCustomizationStep } from './ResumeCustomizationStep'; // Adjusted path
import { ResumePreviewStep } from './ResumePreviewStep'; // Correctly import the preview step
import { sampleResume, defaultResume } from '../../data/resume-data'; // Import both sampleResume and defaultResume
import { Resume, JobPosting, MatchData } from '../../types/resume'; // Adjusted path
import { useIsMobile } from '../../hooks/use-mobile'; // Adjusted path
import { supabase } from '../../integrations/supabase/client'; // Import Supabase client
import { convertParsedDataToResume } from '../../utils/resumeUtils'; // Import helper function

// Constants for steps
const STEPS = {
  ANALYZE: 1,
  CUSTOMIZE: 2,
  PREVIEW: 3,
};

// Update step titles to match screenshots
const STEP_CONFIG = [
  { num: STEPS.ANALYZE, title: "See Your Difference", mobileTitle: "Analyze" },
  { num: STEPS.CUSTOMIZE, title: "Align Your Resume", mobileTitle: "Customize" },
  { num: STEPS.PREVIEW, title: "Review Your New Resume", mobileTitle: "Preview" }
];

// --- Helper functions (calculateMatchData, calculateTailoredScore) remain the same ---
// Helper function to calculate match data (memoized)
const calculateMatchData = (resume: Resume | null, jobPosting: JobPosting | null): MatchData | null => {
  if (!resume || !jobPosting) {
    return null;
  }
  const titleMatch = resume.jobTitle.toLowerCase().includes(jobPosting.title.toLowerCase()) ||
    jobPosting.title.toLowerCase().includes(resume.jobTitle.toLowerCase());
  const experienceMatch = resume.yearsOfExperience >= jobPosting.requiredYearsOfExperience;
  const industryMatches = resume.industries.filter(ind =>
    jobPosting.industries.some(jobInd => jobInd.toLowerCase() === ind.toLowerCase())
  );
  const jobSkillsLower = jobPosting.requiredSkills.map(s => s.toLowerCase());
  const resumeSkillsLower = resume.skills.map(s => s.toLowerCase());
  const skillMatches = resume.skills.filter(skill =>
    jobSkillsLower.includes(skill.toLowerCase())
  );
  const missingSkills = jobPosting.requiredSkills.filter(skill =>
    !resumeSkillsLower.includes(skill.toLowerCase())
  );
  const skillScore = jobPosting.requiredSkills.length > 0
    ? (skillMatches.length / jobPosting.requiredSkills.length) * 5 : 5;
  const expScore = experienceMatch ? 2 : 0;
  const titleScore = titleMatch ? 2 : 0;
  const industryScore = jobPosting.industries.length > 0
    ? (industryMatches.length / jobPosting.industries.length) * 1 : 1;
  const initialScore = Math.min(10, skillScore + expScore + titleScore + industryScore);

  return {
    initialScore: parseFloat(initialScore.toFixed(1)), finalScore: 0, titleMatch, experienceMatch,
    industryMatches, skillMatches, missingSkills, summaryMatch: false
  };
};

// Helper function to calculate tailored score
const calculateTailoredScore = (
  baseMatchData: MatchData,
  selectedSections: { summary: boolean; skills: boolean; experience: boolean },
  addedSkillsCount: number,
  jobPosting: JobPosting
): number => {
  if (!jobPosting || !baseMatchData) return 0;
  const newSkillMatchesCount = baseMatchData.skillMatches.length + addedSkillsCount;
  const totalRequiredSkills = jobPosting.requiredSkills.length;
  const newSkillScore = totalRequiredSkills > 0 ? (newSkillMatchesCount / totalRequiredSkills) * 5 : 5;
  const titleScore = baseMatchData.titleMatch ? 2 : 0;
  const industryScore = jobPosting.industries.length > 0 ? (baseMatchData.industryMatches.length / jobPosting.industries.length) * 1 : 1;
  const summaryScoreBoost = selectedSections.summary ? 1 : 0;
  const experienceScoreBoost = selectedSections.experience ? 1 : 0;
  const baseExperienceScore = baseMatchData.experienceMatch ? 1 : 0;
  const finalScore = Math.min(10, newSkillScore + titleScore + industryScore + baseExperienceScore + summaryScoreBoost + experienceScoreBoost);
  return parseFloat(finalScore.toFixed(1));
};
// --- End Helper Functions ---


interface ResumeTailoringFlowProps {
  jobPosting: JobPosting;
  onClose: () => void;
  // Potentially add a prop for the user's selected base resume if multiple exist
  // baseResume?: Resume;
}

export const ResumeTailoringFlow: React.FC<ResumeTailoringFlowProps> = ({ jobPosting, onClose }) => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const isMobile = useIsMobile();

  // Core State
  const [currentStep, setCurrentStep] = useState(STEPS.ANALYZE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [credits, setCredits] = useState(4); // TODO: Fetch actual user credits

  // Resume Data - Use default for now, ideally load user's primary resume
  const [resume, setResume] = useState<Resume>(defaultResume);
  const [userResumesLoading, setUserResumesLoading] = useState(true);
  const [userResumes, setUserResumes] = useState<Array<{
    id: string;
    name: string;
    file_path: string;
    isPrimary: boolean;
    uploadDate: Date;
  }>>([]);

  // Fetch user's resumes from Supabase
  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('id, name, file_path, is_primary, upload_date')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false })
          .order('upload_date', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setUserResumes(data.map(r => ({
            id: r.id,
            name: r.name,
            file_path: r.file_path || '',
            isPrimary: r.is_primary || false,
            uploadDate: r.upload_date ? new Date(r.upload_date) : new Date()
          })));
        }
      } catch (err) {
        console.error('Error fetching user resumes:', err);
        toast({ 
          title: "Failed to load resumes", 
          description: "There was an issue loading your resumes. Please try again.",
          variant: "destructive" 
        });
      } finally {
        setUserResumesLoading(false);
      }
    };
    
    fetchUserResumes();
  }, [user?.id, toast]);

  // Function to load resume data when selected
  const loadResumeData = async (resumeId: string) => {
    if (!resumeId) return;
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('parsed_data, name')
        .eq('id', resumeId)
        .single();
        
      if (error) throw error;
      
      if (data && data.parsed_data) {
        const mappedResume = convertParsedDataToResume(data.parsed_data, data.name, resumeId);
        setResume(mappedResume);
      } else {
        toast({ 
          title: "Resume data not available", 
          description: "The selected resume does not have parsed data available. Please parse or recreate the resume.",
          variant: "warning" 
        });
      }
    } catch (err) {
      console.error('Error loading resume data:', err);
      toast({ 
        title: "Failed to load resume", 
        description: "There was an issue loading the resume data. Please try again or select a different resume.",
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Analysis and Tailoring State
  const initialMatchData = useMemo(() => calculateMatchData(resume, jobPosting), [resume, jobPosting]);
  const [matchData, setMatchData] = useState<MatchData | null>(initialMatchData);
  const [selectedSections, setSelectedSections] = useState({
    summary: true, skills: true, experience: true, editMode: 'quick' as 'quick' | 'full',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [tailoredResume, setTailoredResume] = useState<Resume | null>(null);
  const [template, setTemplate] = useState('standard');

  // Update matchData when initial calculation changes
  useEffect(() => {
    setMatchData(initialMatchData);
  }, [initialMatchData]);

  // Generate tailored resume
  const generateTailoredResume = useCallback(async () => {
    if (!matchData) {
      toast({ title: "Analysis data missing", description: "Cannot generate resume without analysis.", variant: "destructive" }); return;
    }
    if (!selectedSections.summary && !selectedSections.skills && !selectedSections.experience) {
      toast({ title: "No sections selected", description: "Please select at least one section to enhance.", variant: "destructive" }); return;
    }
    if (credits <= 0) {
      toast({ title: "Insufficient Credits", description: "You need credits to tailor your resume.", variant: "destructive" }); return;
    }
    
    // Only proceed if we have a resume ID
    if (!resume.id) {
      toast({ title: "Resume not selected", description: "Please select a resume to tailor.", variant: "destructive" }); return;
    }

    setIsProcessing(true);
    
    try {
      // Call the tailor-resume Edge Function
      const response = await fetch('https://accojxjdilkrycvnfcpj.supabase.co/functions/v1/tailor-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
        },
        body: JSON.stringify({
          resume_id: resume.id,
          job_posting: jobPosting,
          selected_sections: selectedSections,
          selected_skills: selectedSkills
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to tailor resume');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Invalid response from server');
      }
      
      const tailored = data.data as Resume;
      
      // Calculate the final score
      const finalScore = calculateTailoredScore(matchData, selectedSections, selectedSkills.length, jobPosting);
      setMatchData(prev => prev ? { ...prev, finalScore: finalScore, summaryMatch: selectedSections.summary } : null);
      
      setTailoredResume(tailored);
      setCredits(prev => Math.max(0, prev - 1));
      
      toast({ 
        title: "Resume tailored successfully!", 
        description: `Customized for ${jobPosting.title} at ${jobPosting.company}.` 
      });
      
      setCurrentStep(STEPS.PREVIEW);
    } catch (error) {
      console.error("Error generating tailored resume:", error);
      toast({ 
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "An error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  }, [resume.id, jobPosting, selectedSections, selectedSkills, credits, matchData, toast]);

  // Reset the internal state of the flow (e.g., when restarting within the modal)
  const resetInternalState = useCallback(() => {
    setCurrentStep(STEPS.ANALYZE);
    setSelectedSkills([]);
    setTailoredResume(null);
    setMatchData(initialMatchData);
    setSelectedSections({ summary: true, skills: true, experience: true, editMode: 'quick' });
    // Note: We don't call onClose here, that's handled by the modal's explicit close button
    toast({ title: "Restarted Tailoring", description: "You can customize again." });
  }, [initialMatchData, toast]);

  // Placeholder Download Handler (will be updated in ResumePreviewStep)
  const handleDownload = useCallback((format: 'pdf' | 'docx') => {
    // In a real implementation, this would generate and download the file
    toast({ // Correct toast usage
      title: "Downloading Resume",
      description: `Preparing your resume as a ${format.toUpperCase()} file...`
    });
    // TODO: Implement actual download logic based on tailoredResume and template
  }, [tailoredResume, template, toast]); // Add dependencies

  // Navigation
  const goToNextStep = useCallback(() => { if (currentStep < STEPS.PREVIEW) setCurrentStep(currentStep + 1); }, [currentStep]);
  const goToPrevStep = useCallback(() => { if (currentStep > STEPS.ANALYZE) setCurrentStep(currentStep - 1); }, [currentStep]);

  // Feedback
  const handleFeedback = useCallback((positive: boolean) => {
    // TODO: Send feedback
    toast({ title: "Thanks for your feedback!" });
  }, [toast]);

  // Render Steps
  const StepComponent = useMemo(() => {
    switch (currentStep) {
      case STEPS.ANALYZE:
        return (
          <ResumeAnalysisStep 
            resume={resume} 
            jobPosting={jobPosting} 
            matchData={matchData || null} 
            onContinue={goToNextStep} 
            userResumes={userResumes}
            onResumeSelect={loadResumeData}
            isLoading={isProcessing || userResumesLoading}
          />
        );
      case STEPS.CUSTOMIZE:
        return (
          <ResumeCustomizationStep 
            matchData={matchData} 
            selectedSections={selectedSections} 
            setSelectedSections={setSelectedSections} 
            selectedSkills={selectedSkills} 
            setSelectedSkills={setSelectedSkills} 
            onGenerate={generateTailoredResume} 
            isGenerating={isProcessing} 
          />
        );
      case STEPS.PREVIEW:
        if (isProcessing) {
          return <div className="text-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4">Generating...</p></div>;
        }
        if (tailoredResume && matchData) {
          return (
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
          );
        }
        // Fallback if tailored resume isn't ready (should ideally be handled by loader)
        return <div className="text-center p-12"><h3 className="text-destructive">Error Loading Preview</h3><p className="text-muted-foreground">There was an issue generating the preview.</p><Button onClick={resetInternalState} variant="outline">Start Over</Button></div>;
      default: return null; // Should not happen
    }
  }, [currentStep, resume, jobPosting, matchData, goToNextStep, userResumes, loadResumeData, isProcessing, userResumesLoading, selectedSections, setSelectedSections, selectedSkills, setSelectedSkills, generateTailoredResume, tailoredResume, template, setTemplate, handleFeedback, credits, resetInternalState, handleDownload]);

  return (
    // Removed Layout wrapper
    // Use flex column and overflow-y-auto for modal content scrolling
    <div className="flex flex-col h-full bg-background"> {/* Ensure background color */}
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        {/* Title and Credits */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Generate Your Custom Resume
          </h2>
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
            <span>{credits} credits available today</span>
            <Info className="h-3 w-3" />
          </div>
        </div>
        {/* Default X button from DialogContent will be here */}
      </div>

      {/* Progress Steps - Updated Styling */}
        <div className="relative flex justify-center items-center my-6 px-4 w-full">
        {STEP_CONFIG.map((step, index) => (
          <React.Fragment key={step.num}>
            {/* Connecting Line (before step, except first) */}
            {index > 0 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep >= step.num ? 'bg-primary' : 'bg-border'}`}></div>
            )}

            {/* Step Button */}
            <button
              onClick={() => !isProcessing && step.num <= currentStep && setCurrentStep(step.num)}
                disabled={isProcessing || step.num > currentStep} // Disable future steps
                className={`flex items-center gap-2 text-sm ${
                  step.num > currentStep ? 'text-muted-foreground cursor-default' : 'cursor-pointer hover:text-primary'
                } ${step.num === currentStep ? 'text-primary font-semibold' : ''}`}
              aria-current={step.num === currentStep ? 'step' : undefined}
            >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                    step.num === currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : step.num < currentStep
                      ? 'border-primary bg-primary text-primary-foreground' // Use primary for completed
                    : 'border-border bg-background text-muted-foreground'
                  }`}
              >
                  {step.num < currentStep ? <Check className="h-3.5 w-3.5" /> : step.num}
              </div>
                <span>{step.title}</span>
            </button>
          </React.Fragment>
        ))}
      </div>


      {/* Main Content Area - Takes remaining space and scrolls */}
      {/* Added bg-muted/30 for slight background contrast like screenshots */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 bg-muted/30 dark:bg-muted/10">
        {/* Render the current step component */}
        <div className="mt-6"> {/* Add margin top for spacing */}
          {StepComponent}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-center px-6 py-4 border-t border-border bg-background">
        {currentStep === STEPS.ANALYZE && (
          <Button onClick={goToNextStep} disabled={isProcessing || !matchData} size="lg">
            Begin Improvements Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {currentStep === STEPS.CUSTOMIZE && (
          <div className="flex items-center gap-3">
            <Button onClick={goToPrevStep} disabled={isProcessing} variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={generateTailoredResume} disabled={isProcessing} size="lg">
              {isProcessing ? "Generating..." : "Generate My New Resume"}
              {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}
        {currentStep === STEPS.PREVIEW && (
          <div className="flex items-center gap-3">
            <Button onClick={goToPrevStep} disabled={isProcessing} variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={() => handleDownload('pdf')} disabled={isProcessing || !tailoredResume} size="lg">
              <Download className="mr-2 h-4 w-4" /> Download by PDF
            </Button>
            <Button onClick={() => handleDownload('docx')} disabled={isProcessing || !tailoredResume} size="lg">
              <Download className="mr-2 h-4 w-4" /> Download by Word(.docx)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
