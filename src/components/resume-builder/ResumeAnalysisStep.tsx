
import React, { useState, useEffect } from 'react';
// Import necessary icons and components
import { Check, AlertTriangle, ArrowRight, FileText, Building, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Resume, JobPosting, MatchData } from '@/types/resume';
// Fix import from store, using BaseResume instead of Resume
import { User } from '@/lib/store';
import { Resume as StoreResume } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';

interface ResumeAnalysisStepProps {
  resume: Resume;
  jobPosting: JobPosting;
  matchData: MatchData | null;
  onContinue: () => void;
  userResumes: {
    id: string;
    name: string;
    file_path: string;
    isPrimary: boolean;
    uploadDate: Date;
  }[];
  onResumeSelect: (resumeId: string) => void;
  isLoading?: boolean;
}

export const ResumeAnalysisStep: React.FC<ResumeAnalysisStepProps> = ({
  resume,
  jobPosting,
  matchData,
  onContinue,
  userResumes,
  onResumeSelect,
  isLoading = false
}) => {
  // Make sure we have default values if userResumes is empty
  const [selectedResumeId, setSelectedResumeId] = useState('');

  // Set the first resume as selected when userResumes loads
  useEffect(() => {
    if (userResumes && userResumes.length > 0 && !selectedResumeId) {
      const primaryResumeId = userResumes.find(r => r.isPrimary)?.id || userResumes[0].id;
      setSelectedResumeId(primaryResumeId);
      onResumeSelect(primaryResumeId);
    }
  }, [userResumes, selectedResumeId, onResumeSelect]);

  // Handle resume selection change
  const handleResumeChange = (value: string) => {
    setSelectedResumeId(value);
    onResumeSelect(value);
  };

  const getScoreLabel = (score: number) => {
    if (score < 5) return "Poor";
    if (score < 7) return "Fair";
    return "Good";
  };

  const getScoreColor = (score: number) => {
    if (score < 5) return "text-red-500";
    if (score < 7) return "text-yellow-500";
    return "text-green-500";
  };

  const getGaugeStyle = (score: number) => {
    const percentage = (score / 10) * 100;
    let color;
    if (score < 5) color = '#ef4444';
    else if (score < 7) color = '#f59e0b';
    else color = '#22c55e';

    return {
      // Use theme-aware background for gauge track
      background: `conic-gradient(${color} ${percentage}%, hsl(var(--border)) ${percentage}% 100%)`,
    };
  };

  // Helper to get icon based on match status
  const getMatchIcon = (match: boolean | undefined | null, conditionMet?: boolean) => {
    if (match === true || conditionMet === true) {
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
    }
    if (match === false || conditionMet === false) {
      return <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
    }
    // Default to warning if status is unclear or needs attention
    return <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
  };

  const selectedUserResume = userResumes?.find(r => r.id === selectedResumeId);

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="md:col-span-1 pt-12 flex-col items-center md:items-end">
          <Skeleton className="h-40 w-40 rounded-full mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  // Ensure we have valid data before rendering
  if (!jobPosting || !resume) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Unable to analyze resume. Missing required data.</p>
        <Button onClick={onContinue} className="mt-4">Continue Anyway</Button>
      </div>
    );
  }

  return (
    // Use grid for overall layout
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Left Column (Heading & Table) */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">How Your Resume Aligns with This Job</h2>

        {/* Comparison Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          {/* Table Header Row (Hidden but defines columns) */}
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground border-b border-border">
            <div className="col-span-3">Criteria</div>
            <div className="col-span-4">Job Requirement</div>
            <div className="col-span-5">Your Resume</div>
          </div>

          {/* Overview Row */}
          <div className="grid grid-cols-12 gap-4 p-4 items-start border-b border-border">
            <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
              {/* Placeholder icon or category icon */}
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              Overview
            </div>
            <div className="col-span-4 text-sm">
              <div className="flex items-center gap-2 mb-1">
                {/* Add placeholder for job logo if available */}
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{jobPosting.company}</span>
              </div>
              <p className="text-muted-foreground">{jobPosting.title}</p>
              {/* Add location if available */}
              {jobPosting.location && (
                <p className="text-xs text-muted-foreground">{jobPosting.location}</p>
              )}
            </div>
            <div className="col-span-5 text-sm">
              <Select
                value={selectedResumeId}
                onValueChange={handleResumeChange}
              >
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {userResumes && userResumes.length > 0 ? (
                    userResumes.map(r => (
                      <SelectItem key={r.id} value={r.id} className="text-xs">
                        {r.name} {r.isPrimary && '(Primary)'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="default" disabled className="text-xs">No resumes found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {selectedUserResume && (
                <p className="text-xs text-muted-foreground mt-1">Using: {selectedUserResume.name}</p>
              )}
            </div>
          </div>

          {matchData ? (
            <>
              {/* Job Title Row */}
              <div className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border">
                <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
                  {getMatchIcon(matchData.titleMatch)}
                  Job Title
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">{jobPosting.title}</div>
                <div className="col-span-5 text-sm text-muted-foreground">{resume.jobTitle}</div>
              </div>

              {/* Years of Experience Row */}
              <div className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border">
                <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
                  {getMatchIcon(matchData.experienceMatch)}
                  Years of Experience
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">{jobPosting.requiredYearsOfExperience}+ years exp</div>
                <div className="col-span-5 text-sm text-muted-foreground">{resume.yearsOfExperience} years exp</div>
              </div>

              {/* Industry Experience Row */}
              <div className="grid grid-cols-12 gap-4 p-4 items-start border-b border-border">
                <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
                  {getMatchIcon(null, matchData.industryMatches.length > 0)}
                  Industry Experience
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                  {jobPosting.industries.join(', ')}
                </div>
                <div className="col-span-5 text-sm text-muted-foreground">
                  {resume.industries.join(', ')}
                </div>
              </div>

              {/* Skills Row */}
              <div className="grid grid-cols-12 gap-4 p-4 items-start border-b border-border">
                <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
                  {getMatchIcon(null, matchData.skillMatches.length / jobPosting.requiredSkills.length >= 0.5)} {/* Example threshold */}
                  Skills ({matchData.skillMatches.length}/{jobPosting.requiredSkills.length})
                </div>
                <div className="col-span-9 text-sm text-muted-foreground flex flex-wrap gap-1.5">
                  {jobPosting.requiredSkills.map((skill, index) => {
                    const isMatch = matchData.skillMatches.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <Badge
                        key={index}
                        variant={isMatch ? "default" : "outline"} // Use variants for styling
                        className={`font-normal text-xs ${isMatch ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700' : 'border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400'}`} // Example styling
                      >
                        {skill}
                      </Badge>
                    );
                  })}
                </div>
                {/* Optionally show user's skills below or indicate missing ones */}
              </div>

              {/* Summary Row */}
              <div className="grid grid-cols-12 gap-4 p-4 items-start"> {/* No bottom border on last row */}
                <div className="col-span-3 text-sm font-medium text-foreground flex items-center gap-2">
                  {getMatchIcon(matchData.summaryMatch)} {/* Assuming summaryMatch indicates if it needs work */}
                  Summary
                </div>
                <div className="col-span-9 text-sm text-yellow-600 dark:text-yellow-400">
                  Your current summary does not effectively showcase your qualifications and alignment with this job.
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Analyzing resume match...</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (Score Gauge) */}
      <div className="md:col-span-1 pt-12 flex-col items-center md:items-end">
        {matchData ? (
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center w-full max-w-xs">
            <div className="relative w-32 h-32 mb-3"> {/* Adjusted size */}
              <div
                className="w-full h-full rounded-full"
                style={getGaugeStyle(matchData.initialScore)}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Use theme-aware background */}
                <div className="w-24 h-24 bg-card rounded-full flex flex-col items-center justify-center shadow-inner"> {/* Adjusted size */}
                  <span className="text-3xl font-bold text-foreground">{matchData.initialScore}</span>
                  <span className="text-xs text-muted-foreground">/ 10</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <p className={`text-lg font-medium ${getScoreColor(matchData.initialScore)}`}>
                {getScoreLabel(matchData.initialScore)}
              </p>
              {/* Wrap Info icon with Tooltip */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p>This score indicates the initial match based on your selected resume.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center w-full max-w-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Calculating match score...</p>
          </div>
        )}
      </div>

    </div>
  );
};
