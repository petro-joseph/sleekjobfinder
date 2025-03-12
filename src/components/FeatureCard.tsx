
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div className={cn(
      "p-6 rounded-xl bg-white border border-border shadow-sm transition-all duration-300 hover:shadow-md group",
      className
    )}>
      <div className="mb-4 text-primary p-2 bg-primary/5 rounded-lg inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
