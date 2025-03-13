import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shell } from '@/components/Shell';
import { useQuery } from 'react-query';
import { getJob } from '@/data/jobs';
import { useToast } from "@/hooks/use-toast";
import { FileText, BookmarkX } from "lucide-react";
import { Job } from "@/data/jobs";

const SavedJobs = () => {
  const { toast } = useToast();
  const { user, removeJob } = useAuthStore();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user && user.savedJobs) {
        const jobs = await Promise.all(
          user.savedJobs.map(async (jobId) => {
            try {
              const job = await getJob(jobId);
              return job;
            } catch (error) {
              console.error(`Failed to fetch job with ID ${jobId}:`, error);
              return null;
            }
          })
        );
        setSavedJobs(jobs.filter(Boolean) as Job[]);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const handleRemoveJob = (jobId: string) => {
    removeJob(jobId);
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    toast({
      title: "Job removed from saved list",
      description: "The job has been successfully removed from your saved jobs.",
      variant: "default"
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Shell>
      <div className="grid gap-6">
        <div>
          <h3 className="text-2xl font-bold">Saved Jobs</h3>
          <p className="text-muted-foreground">
            Here are the jobs you've saved.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {savedJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {job.description}
                </p>
                <div className="flex justify-between mt-4">
                  <Button asChild variant="outline">
                    <Link to={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                  <Button variant="destructive" onClick={() => handleRemoveJob(job.id)}>
                    <BookmarkX className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {savedJobs.length === 0 && (
          <div className="text-center">
            <p className="text-muted-foreground">
              You have no saved jobs yet.
            </p>
            <Button asChild>
              <Link to="/">Browse Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default SavedJobs;
