import React from 'react';
import { Job } from '@/data/jobs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Calendar, DollarSign, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { isValidArray, safeToString } from '@/lib/utils';

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: `Your application for ${job.title} has been submitted.`,
    });
  };
  
  // Dummy data for job details sections that might not be in the Job interface
  const responsibilities = [
    "Develop and maintain web applications using React.js and related technologies",
    "Collaborate with the design team to implement responsive UI components",
    "Write clean, efficient, and reusable code",
    "Optimize applications for maximum speed and scalability",
    "Participate in code reviews and contribute to team meetings"
  ];
  
  const requirements = job.requirements || [
    "Bachelor's degree in Computer Science or related field",
    "3+ years of experience with modern JavaScript frameworks",
    "Proficiency in React.js, TypeScript, and related tools",
    "Experience with responsive design and cross-browser compatibility",
    "Strong problem-solving skills and attention to detail"
  ];
  
  const benefits = [
    "Competitive salary and equity package",
    "Health, dental, and vision insurance",
    "Flexible work hours and remote work options",
    "Professional development stipend",
    "401(k) matching program"
  ];

  // Safely render projects if they exist
  const renderProjects = () => {
    if (!isValidArray(job.projects)) {
      return null;
    }
    
    return (
      <section>
        <h2 className="text-lg font-semibold mb-3">Projects</h2>
        <div className="space-y-4">
          {job.projects.map((project, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-4">
              <h3 className="font-medium">{safeToString(project.title)}</h3>
              {project.role && <p className="text-sm text-muted-foreground">Role: {safeToString(project.role)}</p>}
              {project.impact && <p className="text-sm">{safeToString(project.impact)}</p>}
              {project.description && <p className="text-sm">{safeToString(project.description)}</p>}
              {isValidArray(project.technologies) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {safeToString(tech)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <p className="text-lg font-medium mb-4">{job.company}</p>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            {job.type}
          </Badge>
          
          <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </Badge>
          
          <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Posted {job.postedAt}
          </Badge>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="mr-2">
              Fast Apply <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleApply}>Apply Now</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open('/jobs/apply/' + job.id, '_blank')}>
              Apply with Resume
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Position Details */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Position Details</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-muted-foreground">{job.location}</p>
              </div>
              <div>
                <h3 className="font-medium">Compensation</h3>
                <p className="text-muted-foreground">{job.salary}</p>
              </div>
              <div>
                <h3 className="font-medium">Schedule</h3>
                <p className="text-muted-foreground">{job.type}</p>
              </div>
            </div>
          </section>
          
          {/* Job Description */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Job Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
          </section>
          
          {/* Responsibilities */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          {/* Requirements */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Requirements</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          {/* Projects Section (conditionally rendered) */}
          {renderProjects()}
          
          {/* Job Types */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Job Type</h2>
            <p className="text-muted-foreground">{job.type}</p>
          </section>
          
          {/* Pay */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Pay</h2>
            <p className="text-muted-foreground">{job.salary} per year</p>
          </section>
          
          {/* Benefits */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Benefits</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>
          
          {/* Industry */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Industry</h2>
            <p className="text-muted-foreground">{job.industry}</p>
          </section>
          
          {/* Tags */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {isValidArray(job.tags) && job.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {safeToString(tag)}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button className="w-full" onClick={handleApply}>
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobDetails;
