
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ResumeSectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export const ResumeSection = ({ title, onEdit, children }: ResumeSectionProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
};
