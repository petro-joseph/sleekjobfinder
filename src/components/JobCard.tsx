
import { Briefcase, MapPin, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Job } from '@/data/jobs';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  job: Job;
  className?: string;
  onIndustryClick?: (industry: string) => void;
}

const JobCard = ({ job, className, onIndustryClick }: JobCardProps) => {
  return (
    <div className={cn(
      "p-4 md:p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300",
      job.featured && "border-primary/30 bg-primary/[0.02]",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary flex items-center justify-center mr-3 md:mr-4 text-primary font-semibold">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
            ) : (
              job.company.substring(0, 2)
            )}
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        {job.featured && (
          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full hidden md:inline-block">
            Featured
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center">
          <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <Briefcase className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span>{job.postedAt}</span>
        </div>
      </div>
      
      <p className="mb-3 text-sm md:text-base text-foreground/80 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge 
          variant="secondary" 
          className="flex items-center cursor-pointer hover:bg-primary/20 transition-colors text-xs md:text-sm"
          onClick={() => onIndustryClick && onIndustryClick(job.industry)}
        >
          <Tag className="h-3 w-3 mr-1" />
          {job.industry}
        </Badge>
        
        {job.requirements.slice(0, 2).map((req, index) => (
          <span key={index} className="px-2 py-1 text-xs bg-secondary text-foreground/70 rounded-full hidden md:inline-block">
            {req.split(' ').slice(0, 3).join(' ')}...
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t">
        <p className="text-sm md:text-base font-medium">{job.salary}</p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="text-xs md:text-sm px-2 md:px-3 h-8 md:h-9">
            <Link to={`/jobs/${job.id}`}>Details</Link>
          </Button>
          <Button asChild size="sm" className="text-xs md:text-sm px-2 md:px-3 h-8 md:h-9">
            <Link to={`/apply/${job.id}`}>Apply</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
