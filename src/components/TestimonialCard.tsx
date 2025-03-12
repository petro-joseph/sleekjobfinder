
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  className?: string;
}

const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  company, 
  avatar,
  className 
}: TestimonialCardProps) => {
  return (
    <div className={cn(
      "p-6 rounded-xl bg-white border border-border shadow-sm",
      className
    )}>
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 mr-3">
          {avatar ? (
            <img 
              src={avatar} 
              alt={author} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
      <blockquote className="italic text-foreground/90">"{quote}"</blockquote>
    </div>
  );
};

export default TestimonialCard;
