
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Briefcase,
  BookmarkCheck,
  Bell,
  BarChart,
} from 'lucide-react';
import { useCountQueries } from '@/hooks/useCountQueries';
import { useAuthStore } from '@/lib/store';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Memoized statistic card component to prevent unnecessary re-renders
const MobileStatCard = memo(({
  icon,
  value,
  label,
  onClick,
  isLoading = false
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        className="backdrop-blur-xl border-primary/20 border-2 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group hover:border-primary/40 rounded-xl"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <CardContent className="p-4 flex items-center">
          <div className="mr-3 p-2 rounded-full bg-background/50 transition-all group-hover:scale-110">{icon}</div>
          <div>
            <div className="text-2xl font-bold">{isLoading ? '-' : value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Add display name for React DevTools
MobileStatCard.displayName = 'MobileStatCard';

interface DashboardStatsProps {
  onNavigate: (path: string) => void;
}

const DashboardStats = ({ onNavigate }: DashboardStatsProps) => {
  const { user } = useAuthStore();
  const { 
    activeApplicationsCount, 
    isLoadingApplications,
    jobAlertsCount,
    isLoadingJobAlerts
  } = useCountQueries(user?.id);
  
  // These values are already available in the user object without additional queries
  const savedJobsCount = user?.savedJobs?.length || 0;
  const resumesCount = user?.resumes?.length || 0;

  return (
    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={containerVariants}>
      <MobileStatCard
        icon={<Briefcase className="h-5 w-5 text-blue-500" />}
        value={activeApplicationsCount}
        label="Applications"
        onClick={() => onNavigate('/progress')}
        isLoading={isLoadingApplications}
      />
      <MobileStatCard
        icon={<BookmarkCheck className="h-5 w-5 text-green-500" />}
        value={savedJobsCount}
        label="Saved Jobs"
        onClick={() => onNavigate('/saved-jobs')}
        isLoading={false} // Always available from user object
      />
      <MobileStatCard
        icon={<Bell className="h-5 w-5 text-yellow-500" />}
        value={jobAlertsCount}
        label="Job Alerts"
        onClick={() => onNavigate('/progress')}
        isLoading={isLoadingJobAlerts}
      />
      <MobileStatCard
        icon={<BarChart className="h-5 w-5 text-purple-500" />}
        value={resumesCount}
        label="Resumes"
        onClick={() => onNavigate('/manage-resumes')}
        isLoading={false} // Always available from user object
      />
    </motion.div>
  );
};

export default DashboardStats;
