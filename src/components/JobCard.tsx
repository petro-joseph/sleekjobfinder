
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Job } from '@/data/jobs';

interface JobCardProps {
  job: Job;
  className?: string;
}

const JobCard = ({ job, className }: JobCardProps) => {
  return (
    <div className={cn(
      "p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300",
      job.featured && "border-primary/30 bg-primary/[0.02]",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-4 text-primary font-semibold">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
            ) : (
              job.company.substring(0, 2)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
        </div>
        {job.featured && (
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Featured
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-1" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{job.postedAt}</span>
        </div>
      </div>
      
      <p className="mb-4 text-foreground/80 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 2).map((req, index) => (
          <span key={index} className="px-2 py-1 text-xs bg-secondary text-foreground/70 rounded-full">
            {req.split(' ').slice(0, 3).join(' ')}...
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <p className="font-medium">{job.salary}</p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/jobs/${job.id}`}>Details</Link>
          </Button>
          <Button asChild size="sm">
            <Link to={`/apply/${job.id}`}>Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
