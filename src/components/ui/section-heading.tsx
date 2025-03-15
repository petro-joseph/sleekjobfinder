
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({ 
  title, 
  subtitle, 
  centered = false,
  className 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "space-y-2 mb-12",
      centered && "text-center mx-auto",
      className
    )}>
      <h2 className={cn("heading-lg", !centered && "text-left")}>{title}</h2>
      {subtitle && <p className={cn("paragraph", centered && "text-center")}>{subtitle}</p>}
    </div>
  );
}
