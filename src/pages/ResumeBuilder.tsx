import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, Upload, FileText, Download, Check, X, ChevronLeft, ChevronRight, Edit, Trash2, Plus, Minus, ThumbsUp, ThumbsDown } from 'lucide-react';
import Layout from '../components/Layout'; // Corrected path
import { Button } from '../components/ui/button'; // Corrected path
import { Input } from '../components/ui/input'; // Corrected path
import { Textarea } from '../components/ui/textarea'; // Corrected path
import { Label } from '../components/ui/label'; // Corrected path
import { SectionHeading } from '../components/ui/section-heading'; // Corrected path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"; // Corrected path
import { Card, CardContent } from "../components/ui/card"; // Corrected path
import { useToast } from '../hooks/use-toast'; // Corrected path
import { useAuthStore } from '../lib/store'; // Corrected path
import { ResumeAnalysisStep } from '../components/resume-builder/ResumeAnalysisStep'; // Corrected path
import { ResumeCustomizationStep } from '../components/resume-builder/ResumeCustomizationStep'; // Corrected path
import { ResumePreviewStep } from '../components/resume-builder/ResumePreviewStep'; // Corrected path
import { defaultResume, defaultJobPosting } from '../data/resume-data'; // Corrected path
import { Resume, JobPosting, MatchData } from '../types/resume'; // Corrected path
import { useIsMobile } from '../hooks/use-mobile'; // Corrected path

// Constants for steps
const STEPS = {
  ANALYZE: 1,
  CUSTOMIZE: 2,
  PREVIEW: 3,
};

const STEP_CONFIG = [
  { num: STEPS.ANALYZE, title: "See Your Difference", mobileTitle: "Analyze" },
  { num: STEPS.CUSTOMIZE, title: "Align Your Resume", mobileTitle: "Customize" },
  { num: STEPS.PREVIEW, title: "Review Your New Resume", mobileTitle: "Preview" }
];

// Helper function to calculate match data (memoized)
const calculateMatchData = (resume: Resume | null, jobPosting: JobPosting | null): MatchData | null => {
  if (!resume || !jobPosting) {
    return null;
  }

  // Analyze title match (case-insensitive)
  const titleMatch = resume.jobTitle.toLowerCase().includes(jobPosting.title.toLowerCase()) ||
                    jobPosting.title.toLowerCase().includes(resume.jobTitle.toLowerCase());

  // Analyze experience match
  const experienceMatch = resume.yearsOfExperience >= jobPosting.requiredYearsOfExperience;

  // Analyze industry matches
  const industryMatches = resume.industries.filter(ind =>
    jobPosting.industries.some(jobInd => jobInd.toLowerCase() === ind.toLowerCase()) // Case-insensitive comparison
  );

  // Analyze skill matches (case-insensitive)
  const jobSkillsLower = jobPosting.requiredSkills.map(s => s.toLowerCase());
  const resumeSkillsLower = resume.skills.map(s => s.toLowerCase());
  const skillMatches = resume.skills.filter(skill =>
    jobSkillsLower.includes(skill.toLowerCase())
  );

  // Find missing skills
  const missingSkills = jobPosting.requiredSkills.filter(skill =>
    !resumeSkillsLower.includes(skill.toLowerCase())
  );

  // Calculate match score (simplified scoring logic)
  const skillScore = jobPosting.requiredSkills.length > 0
    ? (skillMatches.length / jobPosting.requiredSkills.length) * 5
    : 5; // Max score if no skills required
  const expScore = experienceMatch ? 2 : 0; // Adjusted scoring
  const titleScore = titleMatch ? 2 : 0; // Adjusted scoring
  const industryScore = jobPosting.industries.length > 0
    ? (industryMatches.length / jobPosting.industries.length) * 1
    : 1; // Max score if no industries required

  const initialScore = Math.min(10, skillScore + expScore + titleScore + industryScore);

  return {
    initialScore: parseFloat(initialScore.toFixed(1)),
    finalScore: 0, // Will be set when tailored
    titleMatch,
    experienceMatch,
    industryMatches,
    skillMatches,
    missingSkills,
    summaryMatch: false // Assume summary needs improvement initially
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

    const newSkillScore = totalRequiredSkills > 0
        ? (newSkillMatchesCount / totalRequiredSkills) * 5
        : 5; // Max score if no skills required

    // Base scores from initial analysis
    const titleScore = baseMatchData.titleMatch ? 2 : 0;
    const industryScore = jobPosting.industries.length > 0
        ? (baseMatchData.industryMatches.length / jobPosting.industries.length) * 1
        : 1;

    // Scores based on tailoring actions
    const summaryScoreBoost = selectedSections.summary ? 1 : 0; // Boost for tailoring summary
    const experienceScoreBoost = selectedSections.experience ? 1 : 0; // Boost for tailoring experience
    const baseExperienceScore = baseMatchData.experienceMatch ? 1 : 0; // Base score for meeting requirement

    // Combine scores, ensuring max of 10
    const finalScore = Math.min(
        10,
        newSkillScore +
        titleScore +
        industryScore +
        baseExperienceScore +
        summaryScoreBoost +
        experienceScoreBoost
    );

    return parseFloat(finalScore.toFixed(1));
};


const ResumeBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const isMobile = useIsMobile();

  // Core State
  const [currentStep, setCurrentStep] = useState(STEPS.ANALYZE);
  const [isProcessing, setIsProcessing] = useState(false); // Renamed from isOptimizing
  const [credits, setCredits] = useState(4); // Default credits

  // Resume and Job Data
  const [resume, setResume] = useState<Resume>(defaultResume); // TODO: Allow user to select/upload
  const [jobPosting, setJobPosting] = useState<JobPosting>(defaultJobPosting); // TODO: Allow user to input job details

  // Analysis and Tailoring State
  const initialMatchData = useMemo(() => calculateMatchData(resume, jobPosting), [resume, jobPosting]);
  const [matchData, setMatchData] = useState<MatchData | null>(initialMatchData);
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    skills: true,
    experience: true,
    editMode: 'quick' as 'quick' | 'full', // Ensure type safety
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [tailoredResume, setTailoredResume] = useState<Resume | null>(null);
  const [template, setTemplate] = useState('standard'); // 'standard' or 'compact'

  // Update matchData when initial calculation changes
  useEffect(() => {
    setMatchData(initialMatchData);
  }, [initialMatchData]);


  // --- Commented out potentially unused file upload/optimize logic ---
  // const [activeTab, setActiveTab] = useState('upload');
  // const [fileName, setFileName] = useState<string | null>(null);
  // const [optimized, setOptimized] = useState(false);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFileName(file.name);
  //     // TODO: Implement actual resume parsing here
  //     // setResume(parsedResumeData);
  //     toast({
  //       title: "Resume uploaded",
  //       description: `${file.name} has been uploaded successfully.`, // Corrected description
  //     });
  //     setActiveTab('optimize'); // Switch tab after upload
  //   }
  // };

  // const handleOptimize = () => {
  //   if (!fileName) {
  //     toast({
  //       title: "No resume uploaded",
  //       description: "Please upload a resume file first.",
  //       variant: "destructive"
  //     });
  //     return;
  //   }
  //   setIsProcessing(true);
  //   setTimeout(() => {
  //     setIsProcessing(false);
  //     setOptimized(true);
  //     toast({
  //       title: "Resume optimized!",
  //       description: "Your resume has been tailored for maximum impact.",
  //     });
  //   }, 2000);
  // };

  // const handleDownload = () => {
  //   if (!optimized) {
  //     toast({
  //       title: "No optimized resume",
  //       description: "Please optimize your resume first.",
  //       variant: "destructive"
  //     });
  //     return;
  //   }
  //   // TODO: Implement actual file download logic
  //   toast({
  //     title: "Downloading resume",
  //     description: "Your optimized resume is downloading...",
  //   });
  // };
  // --- End of commented out logic ---


  // Generate tailored resume
  const generateTailoredResume = useCallback(() => {
    if (!matchData) {
        toast({ title: "Analysis data missing", description: "Cannot generate resume without analysis.", variant: "destructive" });
        return;
    }
    if (!selectedSections.summary && !selectedSections.skills && !selectedSections.experience) {
      toast({
        title: "No sections selected",
        description: "Please select at least one section to enhance.",
        variant: "destructive"
      });
      return;
    }
    if (credits <= 0) {
        toast({ title: "Insufficient Credits", description: "You need credits to tailor your resume.", variant: "destructive" });
        return;
    }

    setIsProcessing(true);

    // Simulate API call or heavy processing
    setTimeout(() => {
      try {
        // Create a deep copy to avoid mutating the original resume state
        const tailored = JSON.parse(JSON.stringify(resume)) as Resume;

        // --- Placeholder Tailoring Logic ---
        // In a real app, this would involve more sophisticated NLP/AI processing
        // based on the resume, job posting, and selected options.

        if (selectedSections.summary) {
          // Example: Generate a more targeted summary
          tailored.summary = `Experienced ${resume.jobTitle} with ${resume.yearsOfExperience} years of expertise in ${resume.industries.join(', ')}. Proven track record of delivering results in [Key Area from Job Posting]. Seeking to leverage my skills in ${jobPosting.requiredSkills.slice(0, 3).join(', ')} to drive innovation at [Company Name].`; // Placeholder
        }

        if (selectedSections.skills) {
          // Add selected missing skills (ensure no duplicates)
          const currentSkillsLower = tailored.skills.map(s => s.toLowerCase());
          const skillsToAdd = selectedSkills.filter(s => !currentSkillsLower.includes(s.toLowerCase()));
          tailored.skills = [...tailored.skills, ...skillsToAdd];
        }

        if (selectedSections.experience) {
          const numExperiencesToEnhance = selectedSections.editMode === 'quick' ? Math.min(2, tailored.workExperiences.length) : tailored.workExperiences.length;

          for (let i = 0; i < numExperiencesToEnhance; i++) {
            if (tailored.workExperiences[i]) {
              // Example: Enhance responsibilities with keywords
              const enhancedResponsibilities = tailored.workExperiences[i].responsibilities.map(resp => {
                // Simple random enhancement for demo purposes
                if (Math.random() > 0.8 && jobPosting.requiredSkills.length > 0) { // Enhance 20%
                  return `Led initiatives utilizing ${jobPosting.requiredSkills[Math.floor(Math.random() * jobPosting.requiredSkills.length)]} to improve processes and deliver results.`; // Placeholder
                }
                return resp;
              });

              // Add a new responsibility mentioning a required skill
              if (jobPosting.requiredSkills.length > 0 && Math.random() > 0.5) { // Add 50% of the time
                 enhancedResponsibilities.push(`Implemented solutions using ${jobPosting.requiredSkills[Math.floor(Math.random() * jobPosting.requiredSkills.length)]} to solve complex business challenges.`); // Placeholder
              }

              tailored.workExperiences[i].responsibilities = enhancedResponsibilities;
            }
          }
        }
        // --- End Placeholder Tailoring Logic ---

        // Calculate new match score based on tailored resume
        const finalScore = calculateTailoredScore(matchData, selectedSections, selectedSkills.length, jobPosting);

        // Update match data with final score and summary status
        setMatchData(prev => prev ? {
          ...prev,
          finalScore: finalScore,
          summaryMatch: selectedSections.summary // Reflect if summary was tailored
        } : null);

        setTailoredResume(tailored);
        setCredits(prev => Math.max(0, prev - 1)); // Deduct a credit, ensure non-negative
        setIsProcessing(false);
        setCurrentStep(STEPS.PREVIEW); // Move to the preview step

        toast({
          title: "Resume tailored successfully!",
          description: "Your resume has been customized for this job.",
        });

      } catch (error) {
          console.error("Error generating tailored resume:", error);
          setIsProcessing(false);
          toast({
              title: "Generation Failed",
              description: "An unexpected error occurred while tailoring your resume. Please try again.",
              variant: "destructive"
          });
      }
    }, 1500); // Reduced simulation time
  }, [resume, jobPosting, selectedSections, selectedSkills, credits, matchData, toast]); // Added dependencies

  // Reset the process
  const resetProcess = useCallback(() => {
    setCurrentStep(STEPS.ANALYZE);
    setSelectedSkills([]);
    setTailoredResume(null);
    setMatchData(initialMatchData); // Reset match data to initial calculation
    setSelectedSections({
      summary: true,
      skills: true,
      experience: true,
      editMode: 'quick'
    });
    // setFileName(null); // Reset file name if using upload
    // setOptimized(false); // Reset optimized status if using upload
    toast({ title: "Process Reset", description: "You can start tailoring a new resume."});
  }, [initialMatchData, toast]); // Added dependencies

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    if (currentStep < STEPS.PREVIEW) {
      // Add validation if needed before proceeding (e.g., ensure analysis is done)
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  // Navigate to previous step
  const goToPrevStep = useCallback(() => {
    if (currentStep > STEPS.ANALYZE) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Handle feedback
  const handleFeedback = useCallback((positive: boolean) => {
    // TODO: Send feedback to backend/analytics
    if (positive) {
      toast({
        title: "Thanks for your feedback!",
        description: "We're glad you like your tailored resume.",
      });
    } else {
      toast({
        title: "Feedback Received",
        description: "Thanks for letting us know. We'll use this to improve.",
        variant: "default" // Changed from destructive
      });
    }
  }, [toast]); // Added dependency

  // Memoized step components to avoid re-creating functions on each render
  const StepComponent = useMemo(() => {
     switch (currentStep) {
      case STEPS.ANALYZE:
        return (
          <ResumeAnalysisStep
            resume={resume}
            jobPosting={jobPosting}
            matchData={matchData}
            onContinue={goToNextStep}
            userResumes={user?.resumes || []} // Pass user resumes if available
          />
        );
      case STEPS.CUSTOMIZE:
        return (
          <ResumeCustomizationStep
            matchData={matchData}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections} // Pass setter directly
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills} // Pass setter directly
            onGenerate={generateTailoredResume}
            isGenerating={isProcessing}
          />
        );
      case STEPS.PREVIEW:
        if (isProcessing) { // Show loader while processing before preview
             return (
                <div className="text-center p-12 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
                    <h3 className="text-xl font-medium mb-4">Generating your tailored resume...</h3>
                    {/* Replace with a proper loader component */}
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            );
        }
        if (tailoredResume && matchData) { // Ensure tailoredResume and matchData are available
            return (
                <ResumePreviewStep
                    originalResume={resume}
                    tailoredResume={tailoredResume}
                    setTailoredResume={setTailoredResume} // Allow edits in preview?
                    matchData={matchData}
                    selectedSkills={selectedSkills} // Pass selected skills for context
                    template={template}
                    setTemplate={setTemplate} // Pass setter
                    onFeedback={handleFeedback}
                    credits={credits}
                />
            );
        }
         // Fallback if tailored resume isn't ready (should ideally be handled by loader)
        return (
             <div className="text-center p-12 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
                <h3 className="text-xl font-medium mb-4 text-destructive-foreground">Could not load preview</h3>
                <p className="text-muted-foreground mb-4">There was an issue generating the resume preview.</p>
                <Button onClick={resetProcess} variant="outline">Start Over</Button>
            </div>
        );
      default:
        return null; // Should not happen
    }
  }, [currentStep, resume, jobPosting, matchData, goToNextStep, user?.resumes, selectedSections, setSelectedSections, selectedSkills, setSelectedSkills, generateTailoredResume, isProcessing, tailoredResume, template, setTemplate, handleFeedback, credits, resetProcess]);


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetProcess}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
            aria-label="Reset and start over"
          >
            <X className="h-5 w-5" />
          </Button>

          <h1 className="text-xl md:text-2xl font-bold text-center flex-1 truncate">
            Tailor Your Resume
          </h1>

          <div className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border whitespace-nowrap">
            {credits} credits left
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 max-w-2xl mx-auto px-4">
          {STEP_CONFIG.map((step) => (
            <button
              key={step.num}
              onClick={() => !isProcessing && step.num <= currentStep && setCurrentStep(step.num)} // Allow navigation back, disable during processing
              disabled={isProcessing}
              className={`flex flex-col items-center text-center px-1 group ${step.num > currentStep ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
              aria-current={step.num === currentStep ? 'step' : undefined}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 border-2 transition-colors duration-300 ${
                  step.num === currentStep
                    ? 'border-primary bg-primary text-primary-foreground font-bold'
                    : step.num < currentStep
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-border bg-background group-hover:border-muted-foreground'
                }`}
              >
                {step.num < currentStep ? <Check className="h-4 w-4 md:h-5 md:h-5" /> : step.num}
              </div>
              <span className={`text-xs transition-colors duration-300 ${
                step.num === currentStep ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {isMobile ? step.mobileTitle : step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto">
          <div className="p-4 md:p-6 bg-card text-card-foreground border border-border rounded-xl shadow-sm transition-opacity duration-500 ease-in-out">
             {/* Render the current step component */}
             {StepComponent}
          </div>
        </div>

         {/* Navigation Buttons (Optional - can be placed within steps) */}
         {/* Consider placing navigation within step components for better context */}
         {/* <div className="flex justify-between mt-8 max-w-5xl mx-auto">
            <Button onClick={goToPrevStep} disabled={currentStep === STEPS.ANALYZE || isProcessing} variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            {currentStep < STEPS.PREVIEW ? (
                <Button onClick={goToNextStep} disabled={isProcessing}>
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            ) : (
                 <Button onClick={handleDownload} disabled={!tailoredResume || isProcessing}>
                    <Download className="h-4 w-4 mr-2" /> Download Resume
                </Button>
            )}
         </div> */}

      </div>
    </Layout>
  );
};

export default ResumeBuilder;
