
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchApplications } from '@/api/applications';
import { TableSkeleton } from '@/components/jobs/LoadingState';
import { Application, RecentActivity as RecentActivityType } from '@/types';
import { useAuthStore } from '@/lib/store';

interface RecentActivityProps {
  onNavigate: (path: string) => void;
}

const RecentActivity = ({ onNavigate }: RecentActivityProps) => {
  const { user } = useAuthStore();
  const [recentActivities, setRecentActivities] = useState<RecentActivityType[]>([]);

  // Lazy load applications data
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['recent-activities', user?.id],
    queryFn: () => fetchApplications(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes caching
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });

  // Process applications into recentActivities when data changes
  useEffect(() => {
    if (applications.length > 0) {
      const activities = applications.slice(0, 3).map((app: Application) => ({
        id: app.id,
        position: app.position,
        company: app.company,
        date: app.applied_at
          ? format(new Date(app.applied_at), 'yyyy-MM-dd')
          : format(new Date(app.updated_at), 'yyyy-MM-dd'),
        status: app.status.charAt(0).toUpperCase() + app.status.replace('_', ' ').slice(1),
      }));
      setRecentActivities(activities);
    }
  }, [applications]);

  return (
    <Card className="backdrop-blur-xl border-primary/20 shadow-lg mt-6 hover:border-primary/40 transition-all duration-300 rounded-xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <TableSkeleton />
        ) : recentActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activities</p>
        ) : (
          <>
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                role="listitem"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                <div className="ml-3">
                  <div className="font-medium">{activity.position}</div>
                  <div className="text-sm text-muted-foreground">{activity.company}</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    {format(new Date(activity.date), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${activity.status.toLowerCase() === 'interview'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : activity.status.toLowerCase() === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : activity.status.toLowerCase() === 'offer received'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : activity.status.toLowerCase() === 'archived'
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </motion.div>
            ))}
            <Button
              onClick={() => onNavigate('/progress')}
              variant="ghost"
              className="w-full text-primary justify-center mt-2 touch-button"
            >
              View all activity
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
