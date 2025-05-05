import { useEffect, useState, useTransition } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Bookmark, ExternalLink, Trash2, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Job } from '@/types';
import { fetchSavedJobs, removeSavedJob } from '@/api/savedJobs';
import { SavedJobsSkeleton } from '@/components/jobs/LoadingState';

const SavedJobs = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) return;
    
    const loadSavedJobs = async () => {
      setLoading(true);
      try {
        const savedJobs = await fetchSavedJobs(user.id);
        setJobs(savedJobs);
      } catch (error) {
        toast.error("Error loading saved jobs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedJobs();
  }, [user]);

  const handleRemoveJob = async (jobId: string) => {
    if (!user) return;
    
    startTransition(async () => {
      try {
        await removeSavedJob(user.id, jobId);
        setJobs((jobs) => jobs.filter((job) => job.id !== jobId));
        
        // Update store state
        const updatedSavedJobs = user.savedJobs.filter(job => job.id !== jobId);
        useAuthStore.setState(state => ({
          ...state,
          user: {
            ...state.user!,
            savedJobs: updatedSavedJobs
          }
        }));
        
        toast.success("Job removed from saved jobs");
      } catch (error) {
        toast.error("Error removing job from saved list");
        console.error(error);
      }
    });
  };

  const filteredJobs = searchTerm
    ? jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : jobs;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-primary to-primary/70">
              Saved Jobs
            </h1>
            <p className="text-muted-foreground">
              Jobs you've bookmarked for later consideration
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search saved jobs..."
              className="pl-10 w-full transition-all border-muted/30 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <SavedJobsSkeleton />
        ) : filteredJobs.length === 0 ? (
          <EmptyState searchTerm={searchTerm} navigate={navigate} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <SavedJobCard 
                key={job.id} 
                job={job} 
                onRemove={() => handleRemoveJob(job.id)}
                onView={() => navigate(`/jobs/${job.id}`)}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const EmptyState = ({ searchTerm, navigate }: { searchTerm: string, navigate: (path: string) => void }) => (
  <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg animate-fade-in">
    <CardContent className="p-8 flex flex-col items-center text-center">
      <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
      {searchTerm ? (
        <>
          <h3 className="text-xl font-bold mb-2">No matching saved jobs</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any saved jobs matching "{searchTerm}"
          </p>
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            Browse All Jobs
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-2">No saved jobs yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't saved any jobs yet. Start browsing jobs and save the ones you're interested in.
          </p>
          <Button onClick={() => navigate('/jobs')}>
            Browse Jobs
          </Button>
        </>
      )}
    </CardContent>
  </Card>
);

const SavedJobCard = ({ 
  job, 
  onRemove, 
  onView,
  isPending
}: { 
  job: Job;
  onRemove: () => void;
  onView: () => void;
  isPending: boolean;
}) => {
  return (
    <Card className="glass hover backdrop-blur-xl border-primary/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div 
            className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden bg-primary/10 mr-4"
            style={{ backgroundImage: job.logo ? `url(${job.logo})` : undefined, backgroundSize: 'cover' }}
          >
            {!job.logo && job.company.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{job.company} • {job.location}</p>
            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {job.tags?.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
              {job.tags && job.tags.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  +{job.tags.length - 3}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={onView} className="group-hover:border-primary">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onRemove} 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedJobs;
