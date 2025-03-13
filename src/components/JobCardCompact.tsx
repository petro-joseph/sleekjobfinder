
import { Briefcase, MapPin, BookmarkIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Job } from '@/data/jobs';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';

interface JobCardCompactProps {
  job: Job;
  className?: string;
}

const JobCardCompact = ({ job, className }: JobCardCompactProps) => {
  const { user, saveJob } = useAuthStore();
  const isSaved = user?.savedJobs.includes(job.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveJob(job.id);
    
    if (isSaved) {
      toast.info("Job removed from saved jobs");
    } else {
      toast.success("Job saved to your profile", {
        description: "View all saved jobs in your dashboard"
      });
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "relative p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 group",
        job.featured && "border-primary/40 bg-primary/[0.03]",
        className
      )}
    >
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mr-3 text-primary font-semibold text-sm">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="w-full h-full object-contain rounded-lg" />
          ) : (
            job.company.substring(0, 2)
          )}
        </div>
        <div className="flex-1">
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
            
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-3 h-3 mr-1" />
                <span>{job.type}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                {job.industry}
              </Badge>
              {job.featured && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/10 text-xs">
                  Featured
                </Badge>
              )}
            </div>
          </Link>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={handleSave}
        >
          {isSaved ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <BookmarkIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default JobCardCompact;
