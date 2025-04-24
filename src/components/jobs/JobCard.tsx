
import { forwardRef } from 'react';
import { Briefcase, MapPin, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/data/jobs';

interface JobCardProps {
  job: Job;
  onIndustryClick: (industry: string) => void;
}

export const JobCard = forwardRef<HTMLDivElement, JobCardProps>(
  ({ job, onIndustryClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-5 md:p-6 border rounded-xl bg-card shadow-sm hover:shadow-xl transition-all duration-300",
          job.featured && "border-primary/30 bg-primary/[0.02]"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <span className="text-primary font-semibold text-xl">
                  {job.company.substring(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-foreground">{job.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground mt-1">{job.company}</p>
            </div>
          </div>
          {job.featured && (
            <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full hidden md:inline-block">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1.5" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>{job.postedAt}</span>
          </div>
        </div>

        <p className="mb-4 text-sm md:text-base text-foreground/80 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="secondary"
            className="flex items-center cursor-pointer hover:bg-primary/20 transition-colors text-xs md:text-sm bg-secondary/50"
            onClick={() => onIndustryClick(job.industry)}
          >
            <Tag className="h-3 w-3 mr-1.5" />
            {job.industry}
          </Badge>

          {job.requirements.slice(0, 2).map((req, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs bg-secondary/30 text-foreground/70 rounded-full hidden md:inline-block"
            >
              {req.split(' ').slice(0, 3).join(' ')}...
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm md:text-base font-medium text-primary">{job.salary}</p>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs md:text-sm px-3 md:px-4 h-9 md:h-10 rounded-lg border-border hover:bg-secondary/50 transition-all"
            >
              <Link to={`/jobs/${job.id}`}>Details</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="text-xs md:text-sm px-3 md:px-4 h-9 md:h-10 rounded-lg bg-primary hover:bg-primary/90 transition-all"
            >
              <Link to={`/apply/${job.id}`}>Apply</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

JobCard.displayName = 'JobCard';
