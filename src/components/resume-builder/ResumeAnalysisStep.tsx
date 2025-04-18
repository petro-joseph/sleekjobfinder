
import React, { useState } from 'react';
import { Check, AlertTriangle, ThumbsUp, ThumbsDown, ArrowRight, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Resume, JobPosting, MatchData } from '@/types/resume';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Resume as StoreResume } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResumeAnalysisStepProps {
  resume: Resume;
  jobPosting: JobPosting;
  matchData: MatchData;
  onContinue: () => void;
  userResumes: StoreResume[];
}

export const ResumeAnalysisStep: React.FC<ResumeAnalysisStepProps> = ({ 
  resume, 
  jobPosting, 
  matchData, 
  onContinue,
  userResumes
}) => {
  const [openSections, setOpenSections] = useState({
    overview: true,
    jobTitle: false,
    experience: false,
    industry: false,
    skills: false,
    summary: false
  });
  const [selectedResumeId, setSelectedResumeId] = useState(userResumes[0]?.id || '');

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
      background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}% 100%)`,
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6">How Your Resume Aligns with This Job</h2>
      
      {/* Match Score Gauge */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-2">
          <div 
            className="w-full h-full rounded-full"
            style={getGaugeStyle(matchData.initialScore)}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{matchData.initialScore}/10</span>
            </div>
          </div>
        </div>
        <p className={`text-lg font-medium ${getScoreColor(matchData.initialScore)}`}>
          {getScoreLabel(matchData.initialScore)}
        </p>
      </div>
      
      {/* Analysis Sections */}
      <div className="space-y-4">
        {/* Overview Section */}
        <Collapsible 
          open={openSections.overview} 
          onOpenChange={() => toggleSection('overview')}
          className="border rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/20 text-left">
            <span className="font-medium">Overview</span>
            {openSections.overview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-4">
            <div>
              <p className="font-medium mb-2">Job Position:</p>
              <p>{jobPosting.title} at {jobPosting.company}</p>
            </div>
            
            <div>
              <p className="font-medium mb-2">Select Resume to Use:</p>
              <Select 
                value={selectedResumeId} 
                onValueChange={setSelectedResumeId}
              >
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {userResumes.length > 0 ? (
                    userResumes.map(resume => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="default">Default Resume</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Job Title Section */}
        <Collapsible 
          open={openSections.jobTitle} 
          onOpenChange={() => toggleSection('jobTitle')}
          className="border rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/20 text-left">
            <div className="flex items-center">
              <span className="font-medium">Job Title</span>
              {matchData.titleMatch ? (
                <Check className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="ml-2 h-5 w-5 text-yellow-500" />
              )}
            </div>
            {openSections.jobTitle ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium mb-2">Your Current Title:</p>
                <p>{resume.jobTitle}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Job Posting Title:</p>
                <p>{jobPosting.title}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {matchData.titleMatch 
                ? "Your job title aligns well with the position."
                : "Your job title could be better aligned with the position."}
            </p>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Years of Experience Section */}
        <Collapsible 
          open={openSections.experience} 
          onOpenChange={() => toggleSection('experience')}
          className="border rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/20 text-left">
            <div className="flex items-center">
              <span className="font-medium">Years of Experience</span>
              {matchData.experienceMatch ? (
                <Check className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="ml-2 h-5 w-5 text-yellow-500" />
              )}
            </div>
            {openSections.experience ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium mb-2">Your Experience:</p>
                <p>{resume.yearsOfExperience} years</p>
              </div>
              <div>
                <p className="font-medium mb-2">Required Experience:</p>
                <p>{jobPosting.requiredYearsOfExperience} years</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {matchData.experienceMatch 
                ? "You meet or exceed the required years of experience."
                : "You have less experience than required, but your skills may compensate."}
            </p>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Industry Experience Section */}
        <Collapsible 
          open={openSections.industry} 
          onOpenChange={() => toggleSection('industry')}
          className="border rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/20 text-left">
            <div className="flex items-center">
              <span className="font-medium">Industry Experience</span>
              {matchData.industryMatches.length > 0 ? (
                <Check className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="ml-2 h-5 w-5 text-yellow-500" />
              )}
            </div>
            {openSections.industry ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium mb-2">Your Industries:</p>
                <ul className="list-disc pl-5">
                  {resume.industries.map((industry, index) => (
                    <li key={index}>{industry}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Job Industries:</p>
                <ul className="list-disc pl-5">
                  {jobPosting.industries.map((industry, index) => (
                    <li key={index} className={matchData.industryMatches.includes(industry) ? "text-green-500" : ""}>
                      {industry}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {matchData.industryMatches.length === 0 
                ? "You don't have direct experience in the required industries."
                : `You have experience in ${matchData.industryMatches.length} of the required industries.`}
            </p>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Skills Section */}
        <Collapsible 
          open={openSections.skills} 
          onOpenChange={() => toggleSection('skills')}
          className="border rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/20 text-left">
            <div className="flex items-center">
              <span className="font-medium">
                Skills ({matchData.skillMatches.length}/{jobPosting.requiredSkills.length})
              </span>
              {matchData.skillMatches.length / jobPosting.requiredSkills.length >= 0.6 ? (
                <Check className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="ml-2 h-5 w-5 text-yellow-500" />
              )}
            </div>
            {openSections.skills ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <p className="font-medium mb-4">Job Required Skills:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {jobPosting.requiredSkills.map((skill, index) => {
                const isMatch = matchData.skillMatches.includes(skill);
                return (
                  <div 
                    key={index}
                    className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
                      isMatch ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {skill}
                    {isMatch ? (
                      <ThumbsUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ThumbsDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="font-medium mb-2">Your Skills:</p>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Summary Section */}
        <Collapsible 
          open={openSections.summary} 
          onOpenChange={() => toggleSection('summary')}
          className="border rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary/20 text-left">
            <div className="flex items-center">
              <span className="font-medium">Summary</span>
              <AlertTriangle className="ml-2 h-5 w-5 text-yellow-500" />
            </div>
            {openSections.summary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <p className="font-medium mb-2">Your Current Summary:</p>
            <p className="mb-4">{resume.summary}</p>
            <p className="text-sm text-yellow-600">
              Your current summary does not fully align with this job's requirements. We recommend enhancing it 
              to highlight relevant skills and experience for this specific position.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-center mt-8">
        <Button onClick={onContinue} size="lg">
          Begin Improvements Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
