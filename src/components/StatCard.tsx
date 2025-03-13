
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  gradient?: boolean;
  className?: string;
}

const StatCard = ({ title, value, icon, description, gradient = false, className }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-xl border backdrop-blur-lg bg-card/70 shadow-sm",
        gradient && "bg-gradient-to-br from-primary/10 to-primary/5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
