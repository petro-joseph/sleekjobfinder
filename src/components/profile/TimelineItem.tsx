
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  startDate: string;
  endDate?: string;
  title: string;
  subtitle: string;
  description?: string;
  items?: string[];
  isLast?: boolean;
}

export const TimelineItem = ({
  startDate,
  endDate,
  title,
  subtitle,
  description,
  items,
  isLast
}: TimelineItemProps) => {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
      {!isLast && (
        <div className="absolute left-1 top-4 h-full w-[1px] bg-border" />
      )}
      <div className="space-y-2 pb-8">
        <div className="text-sm text-muted-foreground">
          {startDate} → {endDate || "Present"}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
        {description && <p className="text-sm">{description}</p>}
        {items && items.length > 0 && (
          <ul className="list-disc space-y-1 pl-4 text-sm">
            {items.map((item, index) => (
              <li key={index} className="text-muted-foreground">{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
